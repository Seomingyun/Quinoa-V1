//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "./ISvgManager.sol";

    // struct SvgParams{
    //     string color; // #FFCCCC 형식
    //     string vaultName;
    //     string vaultAddr;
    //     string vaultDate;
    //     string vaultApy;
    //     string vaultVolume;
    //     string vaultDacName;
    // }
    
contract SVG10 {

    function getSvgPart10(
        ISvgManager.SvgParams memory params
    ) external pure returns(string memory) 
    {
        return string(
            abi.encodePacked(
                '<text class="cls-48" text-anchor="middle" alignment-baseline="middle" transform="translate(710, 380)">', 
                '<tspan class="cls-50" x="0" y="0">', 
                params.vaultName, 
                '</tspan>', 
                '</text>', 

                '<text class="cls-24" transform="translate(187.13 451.9)">', 
                '<tspan class="cls-55" x="0" y="0">Adress:</tspan>', 
                '</text>', 
                '<text class="cls-23" transform="translate(287.68 451.59)">', 
                '<tspan class="cls-37" x="0" y="0">', 
                params.vaultAddr, 
                '</tspan>', 
                '</text>', 
                
                '<text class="cls-24" transform="translate(1020.2 451.59)">', 
                '<tspan x="0" y="0">', 
                'Since:', 
                '</tspan>', 
                '</text>', 
                '<text class="cls-22" transform="translate(1099.67 451.9)">', 
                '<tspan x="0" y="0">', 
                params.vaultDate, 
                '</tspan>', 
                '</text>', 

                '<text class="cls-45" transform="translate(184.89 642.5)">', 
                '<tspan x="0" y="0">', 
                'APY', 
                '</tspan>', 
                '</text>', 
                '<rect class="cls-31" x="185.84" y="665.43" width="471" height="1" rx=".5" ry=".5"/>', 
                '<g>', 
                '<text class="cls-33" transform="translate(266.35 788.11)">', 
                '<tspan x="0" y="0">', params.vaultApy, '%', '</tspan>', 
                '</text>', 
                '<g>', 
                '<path class="cls-32" d="M243.06,726.43l-56.44,53.75c-1,.94-2.54-.5-1.56-1.56,0,0,53.75-56.44,53.75-56.44,2.86-2.84,7.11,1.35,4.24,4.24h0Z"/>', 
                '<path class="cls-32" d="M201.09,722.96l39.84-1.66c1.59-.08,2.94,1.15,3,2.74,.02,.24-1.95,39.84-1.95,40.1-.08,1.3-2.02,1.33-2.11,0,0,0-1.95-39.84-1.95-39.84l3,3-39.84-1.66c-1.67-.08-1.7-2.59,0-2.68h0Z"/>', 
                '</g>', 
                '</g>', 

                '<text class="cls-45" transform="translate(779.69 642.5)">', 
                '<tspan class="cls-26" x="0" y="0">T</tspan>', 
                '<tspan x="23.55" y="0">otal </tspan>', 
                '<tspan class="cls-46" x="107" y="0">Volume</tspan>', 
                '</text>', 
                '<text class="cls-57" transform="translate(774.3 788.11)">', 
                '<tspan x="0" y="0">', 
                '$', params.vaultVolume, 
                '</tspan>', 
                '</text>', 

                '<text class="cls-43" transform="translate(188.31 1340.3)">', 
                '<tspan x="0" y="0">By </tspan>', 
                '</text>', 
                '<rect class="cls-31" x="187.77" y="1362.23" width="1061.64" height="1" rx=".5" ry=".5"/>', 
                '<text class="cls-47" transform="translate(260.95 1335.24) rotate(-5.96)"><tspan x="0" y="0">', params.vaultDacName, '</tspan></text>', 
                '<text class="cls-52" transform="translate(1250 1321.5)"><tspan x="0" y="0">', params.vaultDacName, '</tspan></text>'

                '<text class="cls-58" transform="translate(179.39 1064.7)">', 
                '<tspan x="0" y="0">', 
                '$', params.nftEarnings, 
                '</tspan>', 
                '</text>', 
                '<rect class="cls-31" x="185.84" y="942.02" width="471" height="1" rx=".5" ry=".5"/>', 
                '<text class="cls-45" transform="translate(183.31 919.09)">', 
                '<tspan x="0" y="0">Earnings</tspan>', 
                '</text>', 

                '<text class="cls-58" transform="translate(774.67 1064.7)">', 
                '<tspan x="0" y="0">', 
                '$', params.nftHoldings, 
                '</tspan>', 
                '</text>', 
                '<rect class="cls-31" x="781.12" y="942.02" width="471" height="1" rx=".5" ry=".5"/>', 
                '<text class="cls-45" transform="translate(778.59 919.09)">', 
                '<tspan x="0" y="0">Holdings</tspan>', 
                '</text>'
            )
        );
    }
}