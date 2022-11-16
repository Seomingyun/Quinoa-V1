// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library CoinAddresses {
    /// network : mumbai
    ///https://docs.chain.link/docs/data-feeds/price-feeds/addresses/?network=polygon#Mumbai%20Testnet
    function searchAddress(string memory coin) external pure returns(address coinAddr){
        if(keccak256(bytes(coin)) == keccak256(bytes("BTC"))){
            coinAddr = 0x007A22900a3B98143368Bd5906f8E17e9867581b;
        }
        else if(keccak256(bytes(coin)) == keccak256(bytes("DAI"))){
            coinAddr = 0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046;
        }
        else if(keccak256(bytes(coin)) == keccak256(bytes("ETH"))){
            coinAddr = 0x0715A7794a1dc8e42615F059dD6e406A6594651A;
        }
        else if(keccak256(bytes(coin)) == keccak256(bytes("EUR"))){
            coinAddr = 0x7d7356bF6Ee5CDeC22B216581E48eCC700D0497A;
        }
        else if(keccak256(bytes(coin)) == keccak256(bytes("LINK"))){
            coinAddr = 0x1C2252aeeD50e0c9B64bDfF2735Ee3C932F5C408;
        }
        else if(keccak256(bytes(coin)) == keccak256(bytes("MATIC"))){
            coinAddr = 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada;
        }
        else if(keccak256(bytes(coin)) == keccak256(bytes("SAND"))){
            coinAddr = 0x9dd18534b8f456557d11B9DDB14dA89b2e52e308;
        }
        else if(keccak256(bytes(coin)) == keccak256(bytes("USDC"))){
            coinAddr = 0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0;
        }
        else if(keccak256(bytes(coin)) == keccak256(bytes("USDT"))){
            coinAddr = 0x92C09849638959196E976289418e5973CC96d645;
        }
    }
}