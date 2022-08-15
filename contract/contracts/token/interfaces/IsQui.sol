// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISQui is IERC20 {

    event Mint(address to, uint256 amount);

    event Burn(address owner, uint256 amount);

    function mint(address to, uint256 amount) external;

    function burn(address account, uint256 amount) external;
}