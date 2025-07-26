// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {RotaractGovernor} from "../../src/Governance.sol";
import {RotaractToken} from "../../src/RotaractToken.sol";
import {RotaractTimelock} from "../../src/Governance.sol";
import {Treasury} from "../../src/Treasury.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {console} from "forge-std/console.sol";

contract MyGovernorTest is Test {
    RotaractToken token;
    RotaractGovernor governor;
    RotaractTimelock timelock;
    Treasury treasury;

    uint256 public constant MIN_DELAY = 3600; // 1 hour
    uint256 public constant QUORUM_PERCENTAGE = 4; // 4%
    uint256 public constant VOTING_PERIOD = 50400;
    uint256 public constant VOTING_DELAY = 1;

    address[] proposers;
    address[] executors;

    bytes[] functionCalls;
    address[] addressesToCall;
    uint256[] values;

    address public constant VOTER = address(1);

    function setUp() public {
        vm.startPrank(VOTER);
        token = new RotaractToken(1000000 * 10 ** 18);

        token.delegate(VOTER);
        timelock = new RotaractTimelock(MIN_DELAY, proposers, executors);
        governor = new RotaractGovernor(token, timelock);
        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 adminRole = timelock.DEFAULT_ADMIN_ROLE();

        timelock.grantRole(proposerRole, address(governor));
        timelock.grantRole(executorRole, address(0)); // Granting to
        // anyone can execute
        timelock.revokeRole(adminRole, VOTER);

        vm.stopPrank();

        HelperConfig helperConfig = new HelperConfig();
        address ethUsdPriceFeed = helperConfig.activeNetworkConfig();
        treasury = new Treasury(ethUsdPriceFeed);
        treasury.transferOwnership(address(timelock));

        vm.deal(address(treasury), 100 ether);
    }

    function testCanTransferFundWithoutGovernance() public {
        vm.expectRevert();
        treasury.transfer(address(0), 1 ether);
    }

    function testGovernorCanTransferFunds() public {
        // It's good practice to use local variables for proposal data
        // instead of state variables to avoid data leaking between tests.
        address[] memory targets = new address[](1);
        uint256[] memory v = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        uint256 amount = 1 ether;
        // NOTE: The recipient address(0) is the zero address. Funds sent here are irrecoverable.
        // This is fine for a test, but be aware. Let's use address(2) for clarity.
        address recipient = address(2);
        string memory description = "Proposal 1 to transfer funds";

        // Encode the function call to be executed by the Treasury
        bytes memory encodedFunctionCall = abi.encodeWithSelector(treasury.transfer.selector, recipient, amount);

        targets[0] = address(treasury);
        v[0] = 0;
        calldatas[0] = encodedFunctionCall;

        // 1. Propose
        uint256 proposalId = governor.propose(targets, v, calldatas, description);

        console.log("Proposal State at creation:", uint256(governor.state(proposalId))); // Expected: 0 (Pending)
        console.log("Proposal Snapshot (vote start block):", governor.proposalSnapshot(proposalId));

        // This is the key fix: use the *actual* voting delay from the contract.
        uint256 actualVotingDelay = governor.votingDelay();
        console.log("Actual Voting Delay from Governor contract:", actualVotingDelay); // Should be 7200

        // Advance blocks past the voting delay to make the proposal Active
        vm.roll(block.number + actualVotingDelay + 1);

        console.log("Current block number:", block.number);
        console.log(
            "Proposal State after delay:",
            uint256(governor.state(proposalId)) // Expected: 1 (Active)
        );
        // The state must be Active (1) to vote
        assertEq(uint256(governor.state(proposalId)), 1, "Proposal should be Active");

        // 2. Vote
        string memory reason = "I like a do da cha cha";
        uint8 voteWay = 1; // 1 = For
        vm.prank(VOTER);
        governor.castVoteWithReason(proposalId, voteWay, reason);

        // Advance blocks past the voting period
        uint256 actualVotingPeriod = governor.votingPeriod();
        vm.roll(block.number + actualVotingPeriod + 1);

        console.log(
            "Proposal State after voting period:",
            uint256(governor.state(proposalId)) // Expected: 4 (Succeeded)
        );
        // The state must be Succeeded (4) to queue
        assertEq(uint256(governor.state(proposalId)), 4, "Proposal should have Succeeded");

        // 3. Queue the proposal
        bytes32 descriptionHash = keccak256(bytes(description));
        governor.queue(targets, v, calldatas, descriptionHash);

        // Advance time past the timelock's minimum delay
        vm.warp(block.timestamp + MIN_DELAY + 1);
        vm.roll(block.number + 1); // also advance a block

        console.log(
            "Proposal State after queueing and delay:",
            uint256(governor.state(proposalId)) // Expected: 5 (Queued)
        );

        // 4. Execute the proposal
        governor.execute(targets, v, calldatas, descriptionHash);

        console.log(
            "Proposal State after execution:",
            uint256(governor.state(proposalId)) // Expected: 7 (Executed)
        );

        // 5. Verify the funds were transferred
        assert(recipient.balance == amount);
        console.log("Funds successfully transferred to:", recipient);
        console.log("Recipient balance:", recipient.balance);
    }
}
