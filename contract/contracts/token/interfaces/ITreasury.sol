// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ITreasury {

    event Deposit(address user, uint256 amount);
    
    event Withdraw(address user, uint256 amount);

    function deposit(uint256 amount) external;

    function withdraw(uint256 amount) external;
}