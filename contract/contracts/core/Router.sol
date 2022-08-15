// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {IVault} from "./interfaces/IVault.sol";
import {INFTWrappingManager} from "./interfaces/INftWrappingManager.sol";
import {Vault} from "./Vault.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Router is Ownable {
    
    INFTWrappingManager public NFTWrappingManager;

    function setNFTWrappingManager(address _NFTWrappingManager) public onlyOwner {
        NFTWrappingManager = INFTWrappingManager(_NFTWrappingManager);
    }

    /*///////////////////////////////////////////////////////////////
                            Buying
    //////////////////////////////////////////////////////////////*/

    // deposit to vault for the first time
    function buy(address _vault, uint256 _amount) external {
        IVault vault = IVault(_vault);
        IERC20 qvToken = IERC20(vault);
        IERC20 assetToken = IERC20(vault.asset());
        
        // get asset from client
        assetToken.transferFrom(msg.sender, address(this), _amount);

        // exchange asset - qvToken with Vault
        uint256 currentAmount = qvToken.balanceOf(address(this));
        assetToken.approve(address(vault), _amount);
        uint256 qvTokenAdded = vault.deposit(_amount, address(this));
        
        require(qvToken.balanceOf(address(this)) - currentAmount == qvTokenAdded, "Router: Amount of qvToken to relay has unexpected value");
        
        // send qvToken to NFTManager
        qvToken.transfer(address(NFTWrappingManager), qvTokenAdded);
        NFTWrappingManager.deposit(msg.sender, address(vault), qvTokenAdded);

    }

    // add asset to existing NFT
    function buy(uint256 amount, uint256 tokenId ) external {
        
        require(NFTWrappingManager.ownerOf(tokenId) == msg.sender, "only owner of token can change token state");
        (address _vault,,) = NFTWrappingManager.depositInfo(tokenId);
        IVault vault = IVault(_vault);
        IERC20 assetToken = IERC20(vault.asset());
        IERC20 qvToken = IERC20(_vault);

        // get asset from client
        assetToken.transferFrom(msg.sender, address(this), amount);

        // exchange asset - qvToken with Vault
        uint256 currentAmount = qvToken.balanceOf(address(this));
        assetToken.approve(address(vault), amount);
        uint256 qvTokenAdded = vault.deposit(amount, address(this));

        require(qvToken.balanceOf(address(this)) - currentAmount == qvTokenAdded, "Router: Amount of qvToken to relay has unexpected value");
        
        // send qvToken to NFTManager
        qvToken.transfer(address(NFTWrappingManager), qvTokenAdded);
        NFTWrappingManager.deposit(qvTokenAdded, tokenId);
        
    }

    /*///////////////////////////////////////////////////////////////
                            Selling
    //////////////////////////////////////////////////////////////*/

    function sell(uint256 tokenId, uint256 amount) external{
        require(NFTWrappingManager.ownerOf(tokenId) == msg.sender, "only owner of token can change token state");
        (address _vault, uint256 _qvTokenAmount, bool isFullyRedeemed) = NFTWrappingManager.depositInfo(tokenId);
        require(!isFullyRedeemed && amount <= _qvTokenAmount, "not enough token to withdraw");

        IVault vault = IVault(_vault);
        IERC20 qvToken = IERC20(_vault);
        IERC20 assetToken = IERC20(vault.asset());

        // withdraw qvtoken from NFTManager
        uint256 currentAmount = qvToken.balanceOf(address(this));
        NFTWrappingManager.withdraw(tokenId, address(vault), amount);

        require(qvToken.balanceOf(address(this)) - currentAmount == amount, "Router: Amount of qvToken to relay has unexpected value");

        // send qvToken to Vault and redeem it
        uint256 beforeRedeem = assetToken.balanceOf(address(this));
        qvToken.transfer(address(vault), amount);
        uint256 addedAsset = vault.redeem(amount, address(this), address(this));
        require(assetToken.balanceOf(address(this)) - beforeRedeem == addedAsset, "Router: Amount of assetToken to relay has unexpected value");
        
        // send asset to client
        assetToken.transfer(msg.sender, addedAsset);
    }

    /*///////////////////////////////////////////////////////////////
                        Fee claim for SubDAO
    //////////////////////////////////////////////////////////////*/

    function claimFees(uint256 tokenId, uint256 amount) external {
        (address _vault, , ) = NFTWrappingManager.depositInfo(tokenId);
        
        IVault vault = IVault(_vault);
        IERC20 qvToken = IERC20(_vault);

        require(NFTWrappingManager.ownerOf(tokenId) == msg.sender, "Router: only owner of token can change token state");
        require(vault.isAdmin(msg.sender), "Router: sender does not have ADMIN role");
        require(amount >= vault.balanceOf(_vault), "Router: claim too much fees");

        // claim fees
        uint256 currentAmount = qvToken.balanceOf(address(this));
        vault.claimFees(amount);
        require(qvToken.balanceOf(address(this)) - currentAmount == amount, "Router: Amount of qvToken to relay has unexpected value");

        // send qvToken to NFT manager
        qvToken.transfer(address(NFTWrappingManager), amount);
        NFTWrappingManager.deposit(amount, tokenId);
    }
}