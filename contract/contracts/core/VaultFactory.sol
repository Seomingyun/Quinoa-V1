// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Vault} from "./Vault.sol";

contract VaultFactory {
    address[] public vaults;
    address private _router;

    constructor(address router_){
        _router = router_;
    }

    event VaultDeployed(address indexed vaultAddress, string assetName, address indexed user);

    function deployVault(ERC20 asset) external returns (address) {
        Vault newVault = new Vault(asset, msg.sender, _router);
        vaults.push(address(newVault));
        emit VaultDeployed(address(newVault), asset.name(), msg.sender);
        return address(newVault);
    }

    function getVault() view external returns (address[] memory) {
        return vaults;
    }
}