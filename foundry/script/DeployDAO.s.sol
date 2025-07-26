//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {RotaractToken} from "../src/RotaractToken.sol";
import {RotaractGovernor, RotaractTimelock} from "../src/Governance.sol";
import {Treasury} from "../src/Treasury.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployDAO is Script {
    // --- State variables to hold deployed contracts ---
    RotaractToken public token;
    RotaractTimelock public timelock;
    RotaractGovernor public governor;
    Treasury public treasury;

    // --- Constants ---
    uint256 private constant INITIAL_SUPPLY = 1000000 * 10 ** 18;
    uint256 private constant MIN_DELAY = 2; // 2 seconds
    uint256 public constant PERCENT_TO_TREASURY = 50; // 50%
    uint256 private constant TREASURY_FUNDING = 1000 ether; // A reasonable funding amount

    function run() external {
        HelperConfig helperConfig = new HelperConfig();
        address ethUsdPriceFeed = helperConfig.activeNetworkConfig();

        vm.startBroadcast();

        // 1. Deploy all contracts first
        deployContracts(ethUsdPriceFeed);

        // 2. Fund the Treasury *after* it's deployed
        fundTreasury();

        // 3. Configure all roles and ownership
        configureRolesAndOwnership();

        vm.stopBroadcast();
    }

    function deployContracts(address _priceFeed) internal {
        console.log("Deploying contracts...");

        treasury = new Treasury(_priceFeed);
        token = new RotaractToken(INITIAL_SUPPLY);

        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](1);
        executors[0] = address(0);

        timelock = new RotaractTimelock(MIN_DELAY, proposers, executors);
        governor = new RotaractGovernor(token, timelock);
    }

    function fundTreasury() internal {
        console.log("Funding Treasury...");

        // The check in your Treasury's `fund` function will now pass
        // because the price feed mock is working in the context of the test network.
        // We call the `fund` function directly instead of using the low-level `receive`.
        treasury.fund{value: TREASURY_FUNDING}();

        uint256 amountToTreasury = (INITIAL_SUPPLY * PERCENT_TO_TREASURY) / 100;
        token.transfer(address(treasury), amountToTreasury);
        console.log("Transferred %s tokens to Treasury", amountToTreasury);
    }

    function configureRolesAndOwnership() internal {
        console.log("Configuring roles and ownership...");

        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 adminRole = timelock.DEFAULT_ADMIN_ROLE();

        console.log("Granting EXECUTOR_ROLE to the Governor...");
        timelock.grantRole(executorRole, address(governor));

        // You can still allow anyone to execute, but the Governor must be an executor.
        console.log("Granting EXECUTOR_ROLE to address(0) (anyone) as well...");
        timelock.grantRole(executorRole, address(0));

        timelock.grantRole(proposerRole, address(governor));
        timelock.revokeRole(adminRole, msg.sender);

        treasury.transferOwnership(address(timelock));
    }
}