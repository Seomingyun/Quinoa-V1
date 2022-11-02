// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Vault} from "./Vault.sol";

interface IVault {
    function getSharePricePoints() external view returns (uint256, uint256, uint256, uint256);
}
contract VaultFactory {
    address[] public vaults;
    address private _router;
    address private _protocolTreasury;
    address private _svgManager;

    constructor(address router_, address protocolTreasury_, address svgManager_){
        _router = router_;
        _protocolTreasury = protocolTreasury_;
        _svgManager = svgManager_;
    }

    event VaultDeployed(address indexed vaultAddress, string assetName, address indexed user);

    function deployVault(string[] memory params, ERC20 asset) external returns (address) {
        Vault newVault = new Vault(params, asset, msg.sender, _router, _protocolTreasury, _svgManager);
        vaults.push(address(newVault));
        emit VaultDeployed(address(newVault), asset.name(), msg.sender);
        return address(newVault);
    }

    function getVault() view external returns (address[] memory) {
        return vaults;
    }

    // 맞게 돌아갈까가 걱정이네욥 ;;;;;;
    // 뭔가 이것 저것 .. 부동 소숫점을 못 쓴다는게 이렇게 힘들 줄이야 ;; 
    function calculateRoi(uint256 before, uint256 present, uint8 dayCnt) internal pure returns (uint256) {
        // 1 share(=10**decimals) 당 asset 가격이 before, present 파라미터로 들어옴
        uint256 pps_delta = (present - before) / before;
        uint256 annualized_roi = (1 + pps_delta) ** (365 / dayCnt) - 1;
        return annualized_roi;
    }

    function getApys(address vaultAddr) external view returns (uint256 dayApy, uint256 weekApy, uint256 monthApy) {
        (uint256 today, uint256 oneday, uint256 oneweek, uint256 onemonth) = IVault(vaultAddr).getSharePricePoints();
        dayApy = calculateRoi(oneday, today, 1);
        weekApy = calculateRoi(oneweek, today, 7);
        monthApy = calculateRoi(onemonth, today, 30);
    }
}