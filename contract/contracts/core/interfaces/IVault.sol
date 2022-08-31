// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {Strategy, ERC20Strategy} from "../Strategy.sol";

interface IVault is IERC20, IERC20Metadata {

    function isAdmin(address user) external view returns(bool);
    function isDAC(address user) external view returns(bool);

    function setPerformanceFeePercent(uint256 newPerformanceFeePercent) external;
    function setHarvestDelay(uint256 newHarvestDelay) external;
    function setTargetFloatPercent(uint256 newTargetFloatPercent) external;
    function setStrategy(Strategy newStrategy) external;
    function harvest() external;
    function claimFees(uint256 qvTokenAmount) external;
    function depositIntoStrategy(uint256 assetAmount) external;
    function withdrawFromStrategy(uint256 assetAmount) external;
    function setEmergencyExit(bool isEmergency) external;

    // add interface for nft
    function setCurrentPrice(uint256 newCurrentPrice) external;

    // caller(msg.sender), owner(receiver)
    event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares);
    event Withdraw(address indexed caller, address receiver, address owner, uint256 assets, uint256 shares);

    function asset() external view returns (address assetTokenAddress);
    function totalAssets() external view returns (uint256 totalManagedAssets);
    function totalFloat() external view returns (uint256);
    function totalFreeFund() external view returns (uint256);
    function calculateLockedProfit() external view returns (uint256);

    function convertToShares(uint256 assets) external view returns (uint256 shares);
    function convertToAssets(uint256 shares) external view returns (uint256 assets);

    function maxDeposit(address receiver) external view returns (uint256 maxAssets);
    function previewDeposit(uint256 assets) external view returns (uint256 shares);
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);

    function maxMint(address receiver) external view returns (uint256 maxShares);
    function previewMint(uint256 shares) external view returns (uint256 assets);
    function mint(uint256 shares, address receiver) external returns (uint256 assets);

    function maxWithdraw(address owner) external view returns (uint256 maxAssets);
    function previewWithdraw(uint256 assets) external view returns (uint256 shares);
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) external returns (uint256 shares);

    function maxRedeem(address owner) external view returns (uint256 maxShares);
    function previewRedeem(uint256 shares) external view returns (uint256 assets);
    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) external returns (uint256 assets);

}