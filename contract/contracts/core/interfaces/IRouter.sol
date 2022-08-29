// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IRouter{
   
    function buy(address vault, uint256 amount) external;

    function buy(uint256 amount, uint256 tokenId ) external;

    function sell(uint256 tokenId, uint256 amount) external;

    function getNfts(address _vault) external view returns(uint256[] memory tokenIds);

    function getHoldingAssetAmount(address _vault) external view returns(address asset, uint256 amount);
}
