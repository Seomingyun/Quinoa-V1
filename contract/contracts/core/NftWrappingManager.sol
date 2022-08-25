//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC4907.sol";
import "base64-sol/base64.sol";
import "./interfaces/INftWrappingManager.sol";

//@TODO NFT should include APY info. Currently only contains qTokenAmount

contract NftWrappingManager is ERC4907, INFTWrappingManager{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // base image of NFT
    string baseSvg = "";

    event NewNFTMinted(address recipient, uint256 tokenId);
    event NFTImageUpdated(uint256 tokenId);
    event FullyRedeemed(uint256 tokenId);
    
    // NFT로 warpping 될 예치 정보
    struct DepositInfo {
        // 예치된 vault 주소
        address vault;
        // 예치증명 토큰 개수
        uint256 qTokenAmount;

        bool isFullyRedeemed;
    }
    /// @dev tokenID - depoit data
    mapping (uint256 => DepositInfo) private _deposits; 

    address public router;


    constructor( address router_) 
    ERC4907("Quinoa Deposit Certificate NFT", "QUI-CER-NFT"){
        router = router_; 
    }

     /*///////////////////////////////////////////////////////////////
                            Modifier
    //////////////////////////////////////////////////////////////*/

    modifier onlyRouter { // check the msg.sender is router
        require(msg.sender == router);
        _;
    }


    /*///////////////////////////////////////////////////////////////
                    Create NFT image and TokenURL
    //////////////////////////////////////////////////////////////*/
    ///@dev NFT에 들어갈 정보 아직 미정. 현재 qTokenAmount만 표시
    function _createURI(uint256 amount) internal view returns(string memory) {
        ///@Todo fix creating svg considering fianl design and additional arguments, decimals
        string memory svg = string(abi.encodePacked(baseSvg, Strings.toString(amount), "</text></svg>"));
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "Quinoa Depsoit Certificate NFT", "description": "NFT can prove the vault deposit fact", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)),'"}'
            )
        );

        string memory finalTokenUri = string(abi.encodePacked("data:application/json;base64,", json));
        return finalTokenUri;
    }

    ///@dev only router can update tokenURI
    function _updateTokenURI(uint256 tokenId, uint256 amount) internal {
        string memory newURI = _createURI(amount);
        _setTokenURI(tokenId, newURI);
        emit NFTImageUpdated(tokenId);
    }

    /*///////////////////////////////////////////////////////////////
                         Get NFT Information
    //////////////////////////////////////////////////////////////*/

    /// @dev user address - ( vault address - [tokenids..])
    mapping(address => mapping(address  => uint256[])) private _userAssets;

    function getTokenIds(address _user, address _vault) external view onlyRouter returns(uint256[] memory tokenIds){
        return _userAssets[_user][_vault];
    }


    /*///////////////////////////////////////////////////////////////
                Withdraw Process - burn or update NFT
    //////////////////////////////////////////////////////////////*/

    ///@dev get Token id's amount
    function getQtokenAmount(uint256 tokenId) public view returns(uint256){
        
        return _deposits[tokenId].qTokenAmount;
    }

    function isFullWithdraw(uint256 tokenId, uint256 amount) internal view returns(bool){
        return amount == getQtokenAmount(tokenId);
    }


    // @TODO partial withdraw logic 이 vault 당 NFT 가 한개일 경우만 가정함. 기능 추가 시 수정필요.
    function withdraw(uint256 tokenId, address vault, uint256 amount)external onlyRouter {
    
        require(IERC20(vault).balanceOf(address(this)) > amount, "NftWrappingManager: Don't have enough qToken to redeem!");

        if (isFullWithdraw(tokenId, amount) ) {// full withdraw      
            burn(tokenId); 
            _deposits[tokenId].isFullyRedeemed = true;
            emit FullyRedeemed(tokenId);

        } else{ // partial withdraw. update Nft info
            _deposits[tokenId].qTokenAmount -= amount;
            _updateTokenURI(tokenId, _deposits[tokenId].qTokenAmount);
        }
        IERC20(vault).transfer(router, amount);
        
    }

     ///@dev redeem the whole deposit amount
    function burn(uint256 tokenId) internal {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "NftWrappingManager: caller is not token owner nor approved");
        _burn(tokenId);
    }

    /*///////////////////////////////////////////////////////////////
                Deposit Process - create or update NFT
    //////////////////////////////////////////////////////////////*/

    function depositInfo(uint tokenId)
        external
        view
        returns (
            address vault,
            uint256 qTokenAmount,
            bool isFullyRedeemed
        ){
        DepositInfo memory _deposit = _deposits[tokenId];
        return (
            _deposit.vault,
            _deposit.qTokenAmount,
            _deposit.isFullyRedeemed
        );
    }

    function deposit (
        address user,
        address vault,
        uint256 qTokenAmount
    ) onlyRouter external
    {
        DepositInfo memory _deposit = DepositInfo(vault, qTokenAmount, false);
        uint256 tokenId = _tokenIdCounter.current();
        _deposits[tokenId] = _deposit;
        _tokenIdCounter.increment();
        _safeMint(user,tokenId);
        _userAssets[user][vault].push(tokenId);
        _updateTokenURI(tokenId, qTokenAmount);
    }

    function deposit (
        uint256 qTokenAmount,
        uint256 tokenId
    ) onlyRouter external
    {
        _deposits[tokenId].qTokenAmount += qTokenAmount;
        _updateTokenURI(tokenId, _deposits[tokenId].qTokenAmount);
    }
    
}