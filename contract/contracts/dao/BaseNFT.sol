//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";


abstract contract BaseNFT is ERC721Enumerable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    function safeMint(address to)  internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function hasRole(address addr) public view virtual returns(bool) ;
}