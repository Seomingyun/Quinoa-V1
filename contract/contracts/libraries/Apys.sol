// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library Apys {
    // roi 계산(yearn 참고)
    function calculateRoi(uint256 before, uint256 present, uint8 dayCnt) internal pure returns (uint256) {
        // 1 share(=10**decimals) 당 asset 가격이 before, present 파라미터로 들어옴
        if(before == 0) before = 1;
        uint256 pps_delta = (present - before) / before;
        uint256 annualized_roi = (1 + pps_delta) ** (365 / dayCnt) - 1;
        return annualized_roi;
    }

    // // 이 function은 vault의 getSharePricePoint를 호출하여 1일, 7일, 30일의 share price를 가지고 옴 
    // // 근데 NFT에 특정 roi만 넣을 거라면 굳이 필요 없을 것 같음
    // function getApys(address vaultAddr) external view returns (uint256 dayApy, uint256 weekApy, uint256 monthApy) {
    //     (uint256 today, uint256 oneday, uint256 oneweek, uint256 onemonth) = IVault(vaultAddr).getSharePricePoints();
    //     dayApy = calculateRoi(oneday, today, 1);
    //     weekApy = calculateRoi(oneweek, today, 7);
    //     monthApy = calculateRoi(onemonth, today, 30);
    // }
}