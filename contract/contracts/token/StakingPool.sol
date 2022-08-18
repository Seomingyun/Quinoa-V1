// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IStakingPool.sol";

contract StakingPool is ERC20, IStakingPool {
    using Math for uint256;

    IERC20Metadata private immutable _quinoa;
    uint8 private _decimals;

    constructor(IERC20Metadata quinoa_)
    ERC20("Staked-Quinao Token", "sQui") {
        _quinoa = quinoa_;
    }

    function getQuinoa() view override external returns (address){
        return (address(_quinoa));
    }

    function totalQuinoa() view public returns (uint256) {
        return _quinoa.balanceOf(address(this));
    }

    function convertToSQuinoa(uint256 quinoa) public view returns (uint256) {
        return _convertToSQuinoa(quinoa, Math.Rounding.Down);
    }

    function convertToQuinoa(uint256 sQuinoa) public view returns (uint256) {
        return _convertToQuinoa(sQuinoa, Math.Rounding.Down);
    }

    function _convertToSQuinoa(uint256 quinoa, Math.Rounding rounding) internal view returns (uint256) {
        uint256 supply = totalSupply();
        return (quinoa == 0 || supply == 0)
            ? quinoa.mulDiv(10**decimals(), 10**_quinoa.decimals(), rounding)
            : quinoa.mulDiv(supply, totalQuinoa(), rounding);
    }

    function _convertToQuinoa(uint256 sQuinoa, Math.Rounding rounding) internal view returns (uint256) {
        uint256 supply = totalSupply();
        return
            (supply == 0)
                ? sQuinoa.mulDiv(10**_quinoa.decimals(), 10**decimals(), rounding) // return x * y / z;
                : sQuinoa.mulDiv(totalQuinoa(), supply, rounding);
    }

    // qui token 기준 amount
    function deposit(uint256 quinoa) override external {
        uint256 sQuinoa = convertToSQuinoa(quinoa);
        require(sQuinoa > 0, "StakingPool: deposit less than minimum");
        _quinoa.transferFrom(_msgSender(), address(this), quinoa);
        _mint(_msgSender(), sQuinoa);
        emit Deposit(_msgSender(), quinoa, sQuinoa);
    }

    // qui token 기준 amount
    function withdraw(uint256 quinoa) override external {
        uint256 sQuinoa;

        if(quinoa == type(uint256).max) { // withdraw all
            sQuinoa = balanceOf(_msgSender());
            quinoa = convertToQuinoa(sQuinoa);
        }
        else{
            sQuinoa = convertToSQuinoa(quinoa);
        }

        require(sQuinoa > 0, "StakingPool: withdraw less than minimum");
        require(sQuinoa <= balanceOf(_msgSender()), "StakingPool: withdraw more than max");
        _burn(_msgSender(), sQuinoa);
        _quinoa.transfer(_msgSender(), quinoa);

        emit Withdraw(_msgSender(), quinoa, sQuinoa);
    }

    // sQuinoa token 기준 amount
    function redeem(uint256 sQuinoa) override external {
        uint256 quinoa;

        if(sQuinoa == type(uint256).max) {
            sQuinoa = balanceOf(_msgSender());
        }
        quinoa = convertToQuinoa(sQuinoa);

        require(quinoa > 0, "StakingPool: redeem less than minimum");
        require(sQuinoa <= balanceOf(_msgSender()), "StakingPool: redeem more than max");
        _burn(_msgSender(), sQuinoa);
        _quinoa.transfer(_msgSender(), quinoa);

        emit Redeem(_msgSender(), quinoa, sQuinoa);
    }

}