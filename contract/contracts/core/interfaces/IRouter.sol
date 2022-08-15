// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IRouter{
   
    function buy(address vault, uint256 amount) external;

    function buy(uint256 amount, uint256 tokenId ) external;

    function sell(uint256 tokenId, uint256 amount) external;

}
