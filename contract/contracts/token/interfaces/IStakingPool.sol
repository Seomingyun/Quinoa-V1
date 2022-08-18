// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IStakingPool {
    event Deposit(address user, uint256 quinoa, uint256 sQuinoa);
    event Withdraw(address user, uint256 quinoa, uint256 sQuinoa);
    event Redeem(address user, uint256 quinoa, uint256 sQuinoa);

    function deposit(uint256 quinoa) external;
    function withdraw(uint256 quinoa) external;
    function redeem(uint256 sQuinoa) external;
    function getQuinoa() external returns (address);
}