// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interfaces/ITreasury.sol";
import "./interfaces/ISQui.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Treasury
 * @notice Treasury(for staking) implementation
 */
contract Treasury is ITreasury, Ownable {
    IERC20 public qui;
    ISQui public sQui;
    IERC721 public generalMembership;
    IERC721 public guruMembership;

    /**
     * @dev Only DAO members can call functions marked by this modifier
     */
    modifier onlyDAO {
        require(guruMembership.balanceOf(_msgSender()) > 0 || generalMembership.balanceOf(_msgSender()) > 0, 
                "Treasury: Only DAO member can stake in treausy");
        _;
    }

    /**
     * @dev Set assets(qui, sQui, NFTmembership) in treasury
     * qui token and sQui token is using for staking
     * membership NFT is using for checking who is DAO members
     */
    function setAsset(address _qui, address _sQui, address _general, address _guru) public onlyOwner {
        qui = IERC20(_qui);
        sQui = ISQui(_sQui);
        guruMembership = IERC721(_guru);
        generalMembership = IERC721(_general);
    }

    /**
     * @notice Get assets in treasury 
     * This function return addresses about assets
     */
    function getAsset() public view returns(address, address, address, address) {
        return (address(qui), address(sQui), address(generalMembership), address(guruMembership));
    }

    /**
     * @notice Deposit the qui tokens and get sQui token for the proof of staking
     * @param amount Amount of the qui tokens to stake in this treasury
     */
    function deposit(uint256 amount) external override onlyDAO {
        qui.transferFrom(_msgSender(), address(this), amount); // user -(qui)-> treasury
        sQui.mint(_msgSender(), amount); // 0x0 -(sQui)-> user

        emit Deposit(_msgSender(), amount);
    }

    /**
     * @notice Withdraw the qui tokens and burn the sQui tokens 
     * @param amount Amount of the qui tokens to withdraw in this treasury
     */
    function withdraw(uint256 amount) external override onlyDAO {
        require(sQui.balanceOf(_msgSender()) >= amount, "Treasury: withdraw amount exceeds sQui balance");
        
        sQui.burn(_msgSender(), amount); // msg.sender() -(sQui)-> 0x0
        qui.transfer(_msgSender(), amount); // treasury -(qui)-> msg.sender
        
        emit Withdraw(_msgSender(), amount);
    }

}