//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BaseNFT.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract GuruNFT is BaseNFT{
    error SoulBound();

    mapping(address => bool) public WhitelistClaimed;
    bytes32 public merkleRoot;

    
    constructor (bytes32 _merkleRoot )
    ERC721("Quinoa-Guru", "GURU"){
        merkleRoot = _merkleRoot;
    }

    function hasRole(address addr) public view override returns (bool){
        // 롤들이 서로 배타적이여야 하나욤..?
        return this.balanceOf(addr) > 0;
    }

    function airdrop(bytes32[] calldata _merkleProof, address claiming) public {
        require(!WhitelistClaimed[msg.sender], "Address already claimed");
        bytes32 leaf  = keccak256(abi.encodePacked(claiming));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "Invalid Merkle Proof!");
        WhitelistClaimed[msg.sender] = true;
        safeMint(claiming);
    }

    function getTokenId(address owner) public view returns(uint256) {
      return tokenOfOwnerByIndex(owner, 0);
    }

    // function getTokenId(address owner, uint256 index) public view  returns (uint256) {
    //     return tokenOfOwnerByIndex(owner, 0);
    // }

    /// --- Disabling Transfer Of Soulbound NFT --- ///

  /// @notice Function disabled as cannot transfer a soulbound nft
  function safeTransferFrom(
    address, 
    address, 
    uint256,
    bytes memory
  ) public pure override {
    revert SoulBound();
  }

  /// @notice Function disabled as cannot transfer a soulbound nft
  function safeTransferFrom(
    address, 
    address, 
    uint256 
  ) public pure override {
    revert SoulBound();
  }

  /// @notice Function disabled as cannot transfer a soulbound nft
  function transferFrom(
    address, 
    address, 
    uint256
  ) public pure override{
    revert SoulBound();
  }

  /// @notice Function disabled as cannot transfer a soulbound nft
  function approve(
    address, 
    uint256
  ) public pure override {
    revert SoulBound();
  }

  /// @notice Function disabled as cannot transfer a soulbound nft
  function setApprovalForAll(
    address, 
    bool
  ) public pure override {
    revert SoulBound();
  }

  /// @notice Function disabled as cannot transfer a soulbound nft
  function getApproved(
    uint256
  ) public pure override returns (address) {
    revert SoulBound();
  }

  /// @notice Function disabled as cannot transfer a soulbound nft
  function isApprovedForAll(
    address, 
    address
  ) public pure override returns (bool) {
    revert SoulBound();
  }
    
}