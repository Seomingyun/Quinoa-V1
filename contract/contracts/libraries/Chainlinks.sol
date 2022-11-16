// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


import "contract/contracts/libraries/CoinAddresses.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Chainlinks {

    /**
     * Returns the latest price
     */
    function getLatestPrice(string memory coin) public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AggregatorV3Interface(CoinAddresses.searchAddress(coin)).latestRoundData();
        return price;
    }
}