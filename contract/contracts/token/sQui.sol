// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interfaces/ISQui.sol";

/**
 * @title Staked Quinoa Token
 * @notice Staked Quinoa Token implementation
 * This token is proof of staking the qui tokens
 **/
contract SQui is ISQui, ERC20{

    address public immutable treasury; 

    /**
     * @dev Constructors
     * @param _treasury The address of the Treasury contract
     */
    constructor(address _treasury) ERC20("sQuinoa", "sQui") {
        treasury = _treasury;
    }

    /**
     * @dev only the Treasury contract can call functions marked by this modifier
     */
    modifier onlyTreasury() {
        require(treasury == _msgSender(), "onlyTreasury: caller is not the Treasury");
        _;
    }

    /**
     * @dev Mint sQui token for proof of staking
     * @param to The receipient address 
     * @param amount The amount of the sQui tokens to mint
     */
    function mint(address to, uint256 amount) external override onlyTreasury {
        _mint(to, amount);

        emit Mint(to, amount);
    }

    /**
     * @dev Burn sQui token because sQui is withdrawed in treasury
     * @param from The address who have sQui to burn
     * @param amount The amount of the sQui tokens to burn
     */
    function burn(address from, uint256 amount) external override onlyTreasury {
        _burn(from, amount);

        emit Burn(from, amount);
    }

    /**
     * @dev sQui cannot trasfer
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(false, "sQuinao Token cannot transfer");
        super._transfer(from, to, amount);
    }

}