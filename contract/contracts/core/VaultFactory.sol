// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Vault} from "./Vault.sol";

contract VaultFactory {
    address[] public vaults;
    address private _router;
    address private _protocolTreasury;

    constructor(address router_, address protocolTreasury_){
        _router = router_;
        _protocolTreasury = protocolTreasury_;
    }

    //event VaultDeployed(address indexed vaultAddress, string assetName, address indexed user);

    function deployVault(ERC20 asset) external returns (address) {
        Vault newVault = new Vault(asset, msg.sender, _router, _protocolTreasury);
        vaults.push(address(newVault));
        //emit VaultDeployed(address(newVault), asset.name(), msg.sender);
        return address(newVault);
    }

    function getVault() view external returns (address[] memory) {
        return vaults;
    }
}