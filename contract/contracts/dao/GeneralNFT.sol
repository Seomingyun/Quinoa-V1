//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BaseNFT.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IQui {
    function burnQui(address owner, address spender, uint256 amount) external;
}

contract GeneralNFT is BaseNFT, ERC2981, Ownable {

    uint256 public nftPrice;
    address public qui;
    address public treasury;
    string public contractURI;

    RoyaltyInfo private _defaultRoyaltyInfo;

    constructor ( 
        uint256 _nftPrice, 
        uint96 _royaltyFeeNumerator, 
        address _treasury
    ) ERC721("Quinoa-General", "GENERAL"){
        nftPrice = _nftPrice;
        treasury = _treasury;
        setRoyaltyInfo(treasury, _royaltyFeeNumerator);
    }

    function hasRole(address addr) public view override returns (bool){
        // 롤들이 서로 배타적이여야 하나욤..?
        return this.balanceOf(addr) > 0;
    }

    function setQUiAddress(address _qui) external onlyOwner {
        require(_qui != address(0), "GeneralNFT: Qui contract address is zero address");
        qui = _qui;
    }

    function setTreasuryAddress(address _treasury) external onlyOwner{
        require(_treasury != address(0), "GeneralNFT: Treasury contract address is zero address");
        treasury = _treasury;
        setRoyaltyInfo(treasury, _defaultRoyaltyInfo.royaltyFraction);
    }


    function buy() external {
        //IERC20(qui).approve(qui, nftPrice);
        IQui(qui).burnQui(msg.sender, address(this), nftPrice);
        safeMint(msg.sender);
    }
    
    function setRoyaltyInfo(address _receiver, uint96 _royaltyFees) public onlyOwner {
        _setDefaultRoyalty(_receiver, _royaltyFees);
    }

    function setContractURI(string calldata _contractURI) public onlyOwner {
        contractURI = _contractURI;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC2981, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // 해당 토큰의 로열티 정보가 모두 동일하므로 defaultRoyaltyInfo 를 return
    function getRoyaltyInfo(uint256 _salePrice) 
    external view 
    returns(address, uint256) {
        return (
            _defaultRoyaltyInfo.receiver,
            _salePrice * _defaultRoyaltyInfo.royaltyFraction
        );
    }
}