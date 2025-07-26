// SPDX-License-Identifier: MIT

// Fund
// Withdraw

pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";
import {Treasury} from "../src/Treasury.sol";
import {console} from "forge-std/console.sol";

contract FundTreasury is Script {
    uint256 constant SEND_VALUE = 0.01 ether;

    function fundTreasury(address mostRecentlyDeployed) public {
        vm.startBroadcast();
        Treasury(payable(mostRecentlyDeployed)).fund{value: SEND_VALUE}();
        vm.stopBroadcast();
        console.log("Funded Treasury with %s", SEND_VALUE);
    }

    function run() external {
        address mostRecentlyDeployed = DevOpsTools.get_most_recent_deployment("Treasury", block.chainid);
        fundTreasury(mostRecentlyDeployed);
    }
}

contract WithdrawTreasury is Script {
    function withdrawTreasury(address mostRecentlyDeployed) public {
        vm.startBroadcast();
        Treasury(payable(mostRecentlyDeployed)).withdraw();
        vm.stopBroadcast();
    }

    function run() external {
        address mostRecentlyDeployed = DevOpsTools.get_most_recent_deployment("Treasury", block.chainid);
        withdrawTreasury(mostRecentlyDeployed);
    }
}
