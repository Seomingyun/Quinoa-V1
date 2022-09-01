// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ISvgManager.sol";

interface ISVG {

    function getSvgPart1(string memory color) external pure returns(string memory);
    function getSvgPart2() external pure returns(string memory);
    function getSvgPart3() external pure returns(string memory);
    function getSvgPart4() external pure returns(string memory);
    function getSvgPart5() external pure returns(string memory);
    function getSvgPart6() external pure returns(string memory);
    function getSvgPart7() external pure returns(string memory);
    function getSvgPart8() external pure returns(string memory);
    function getSvgPart9() external pure returns(string memory);
    function getSvgPart10(ISvgManager.SvgParams memory params) external pure returns(string memory);

}

contract SvgManager is ISvgManager{

    SvgAddrs SVG_ADDRS;


    constructor(SvgAddrs memory addrs){
        SVG_ADDRS = addrs;
    }

    function generateVaultSvg(SvgParams memory params) external view override returns(string memory) {
        return string(
            abi.encodePacked(
                '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1437.17 1536.38">', 
                 ISVG(SVG_ADDRS.svg1).getSvgPart1(params.color),
                 ISVG(SVG_ADDRS.svg2).getSvgPart2(),
                 ISVG(SVG_ADDRS.svg3).getSvgPart3(),
                 ISVG(SVG_ADDRS.svg4).getSvgPart4(),
                 ISVG(SVG_ADDRS.svg5).getSvgPart5(),
                 ISVG(SVG_ADDRS.svg5).getSvgPart6(),
                 ISVG(SVG_ADDRS.svg5).getSvgPart7(),
                 ISVG(SVG_ADDRS.svg5).getSvgPart8(),
                 ISVG(SVG_ADDRS.svg5).getSvgPart9(),
                 ISVG(SVG_ADDRS.svg6).getSvgPart10(params),
                '</svg>'
            )
        );
    }

}