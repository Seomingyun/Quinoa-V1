//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

interface ISvgManager {
    struct SvgParams{
        string color; // #FFCCCC 형식
        string vaultName;
        string vaultAddr;
        string vaultDate;
        string vaultApy;
        string vaultVolume;
        string vaultDacName;
    }

    struct SvgAddrs{
        address svg1;
        address svg2;
        address svg3;
        address svg4;
        address svg5;
        address svg6;
        address svg7;
        address svg8;
        address svg9;
        address svg10;
    }

    function generateVaultSvg(SvgParams memory params) external view returns(string memory);
}
