// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

library Utils {
    using Math for uint256;

    // https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary/blob/master/contracts/BokkyPooBahsDateTimeLibrary.sol
    function timestampToDate(uint timestamp) public pure returns (uint year, uint month, uint day) {
        uint SECONDS_PER_DAY = 24 * 60 * 60;
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }
    
    function _daysToDate(uint _days) internal pure returns (uint year, uint month, uint day) {
        int __days = int(_days);

        int OFFSET19700101 = 2440588;

        int L = __days + 68569 + OFFSET19700101;
        int N = 4 * L / 146097;
        L = L - (146097 * N + 3) / 4;
        int _year = 4000 * (L + 1) / 1461001;
        L = L - 1461 * _year / 4 + 31;
        int _month = 80 * L / 2447;
        int _day = L - 2447 * _month / 80;
        L = _month / 11;
        _month = _month + 2 - 12 * L;
        _year = 100 * (N - 49) + _year + L;

        year = uint(_year);
        month = uint(_month);
        day = uint(_day);
    }

    function volumeToString(uint256 totalVolume) public pure returns(string memory){
        totalVolume = totalVolume.mulDiv(1, 1e16, Math.Rounding.Down); // 0.01 단위까지 되는지 확인

        if(totalVolume==0){
            return "0.00";
        }
        else if(0<totalVolume && totalVolume<10){
            string memory prefix = "0.0";
            string memory postfix = Strings.toString(totalVolume);
            return string(abi.encodePacked(prefix, postfix));
        }
        else if(10<=totalVolume && totalVolume<100){
            string memory prefix = "0.";
            string memory postfix = Strings.toString(totalVolume);
            return string(abi.encodePacked(prefix, postfix));
        }
        else if(100<=totalVolume && totalVolume<100000){
            uint256 integerNum = totalVolume.mulDiv(1, 100, Math.Rounding.Down);
            string memory prefix = Strings.toString(integerNum);
            string memory postfix = Strings.toString(totalVolume - (integerNum*100));
            return string(abi.encodePacked(prefix, '.', postfix));
        }
        else if(100000<=totalVolume && totalVolume<100000000){
            totalVolume = totalVolume.mulDiv(1, 1000, Math.Rounding.Down);
            uint256 integerNum = totalVolume.mulDiv(1, 100, Math.Rounding.Down);
            string memory prefix = Strings.toString(integerNum);
            string memory postfix = Strings.toString(totalVolume - (integerNum*100));
            return string(abi.encodePacked(prefix, '.', postfix, 'K'));
        }
        else if (100000000<=totalVolume && totalVolume<100000000000){
            totalVolume = totalVolume.mulDiv(1, 1000000, Math.Rounding.Down);
            uint256 integerNum = totalVolume.mulDiv(1, 100, Math.Rounding.Down);
            string memory prefix = Strings.toString(integerNum);
            string memory postfix = Strings.toString(totalVolume - (integerNum*100));
            return string(abi.encodePacked(prefix, '.', postfix, 'M'));
        }     
        else {
            return "MAX";
        }
    }
}