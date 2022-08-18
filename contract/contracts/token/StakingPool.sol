// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IStakingPool.sol";

contract StakingPool is ERC20, IStakingPool {
    using Math for uint256;

    IERC20Metadata private immutable _qui;
    uint8 private _decimals;

    constructor(IERC20Metadata qui_)
    ERC20("Staked-Quinao Token", "sQui") {
        _qui = qui_;
    }

    function getQuiAddress() view override public returns (address){
        return (address(_qui));
    }

    function getQuiBalance() view override public returns (uint256) {
        return _qui.balanceOf(address(this));
    }

    function convertToSQui(uint256 qui) public view returns (uint256) {
        return _convertToSQui(qui, Math.Rounding.Down);
    }

    function convertToQui(uint256 sQui) public view returns (uint256) {
        return _convertToQui(sQui, Math.Rounding.Down);
    }

    function _convertToSQui(uint256 qui, Math.Rounding rounding) internal view returns (uint256) {
        uint256 supply = totalSupply();
        return (qui == 0 || supply == 0)
            ? qui.mulDiv(10**decimals(), 10**_qui.decimals(), rounding)
            : qui.mulDiv(supply, getQuiBalance(), rounding);
    }

    function _convertToQui(uint256 sQui, Math.Rounding rounding) internal view returns (uint256) {
        uint256 supply = totalSupply();
        return
            (supply == 0)
                ? sQui.mulDiv(10**_qui.decimals(), 10**decimals(), rounding) // return x * y / z;
                : sQui.mulDiv(getQuiBalance(), supply, rounding);
    }

    // qui token 기준 amount
    function deposit(uint256 qui) override external {
        uint256 sQui = convertToSQui(qui);
        require(sQui > 0, "StakingPool: deposit less than minimum");
        _qui.transferFrom(_msgSender(), address(this), qui);
        _mint(_msgSender(), sQui);
        emit Deposit(_msgSender(), qui, sQui);
    }

    // qui token 기준 amount
    function withdraw(uint256 qui) override external {
        uint256 sQui;

        if(qui == type(uint256).max) { // withdraw all
            sQui = balanceOf(_msgSender());
            qui = convertToQui(sQui);
        }
        else{
            sQui = convertToSQui(qui);
        }

        require(sQui > 0, "StakingPool: withdraw less than minimum");
        require(sQui <= balanceOf(_msgSender()), "StakingPool: withdraw more than max");
        _burn(_msgSender(), sQui);
        _qui.transfer(_msgSender(), qui);

        emit Withdraw(_msgSender(), qui, sQui);
    }

    // sQui token 기준 amount
    function redeem(uint256 sQui) override external {
        uint256 qui;

        if(sQui == type(uint256).max) {
            sQui = balanceOf(_msgSender());
        }
        qui = convertToQui(sQui);

        require(qui > 0, "StakingPool: redeem less than minimum");
        require(sQui <= balanceOf(_msgSender()), "StakingPool: redeem more than max");
        _burn(_msgSender(), sQui);
        _qui.transfer(_msgSender(), qui);

        emit Redeem(_msgSender(), qui, sQui);
    }

}