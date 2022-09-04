//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./ERC4907.sol";
import "base64-sol/base64.sol";
import "./interfaces/INftWrappingManager.sol";
import "../libraries/Utils.sol";
import "../svg/ISvgManager.sol";
import "./interfaces/IVault.sol";

//@TODO NFT should include APY info. Currently only contains qTokenAmount

contract NftWrappingManager is ERC4907, INFTWrappingManager{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    using Math for uint256;

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
    address public svgManager;


    constructor( address router_, address svgManager_) 
    ERC4907("Quinoa Deposit Certificate NFT", "QUI-CER-NFT"){
        router = router_; 
        svgManager = svgManager_;
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
    function tokenInfoSvg(uint256 tokenId) public view override returns(string memory){
        IVault tokenVault = IVault(_deposits[tokenId].vault);
        string[8] memory vaultInfo = tokenVault.vaultInfo(); // vault 정보

        uint256 totalHoldings = (tokenVault.totalAssets()).mulDiv(_deposits[tokenId].qTokenAmount, tokenVault.totalSupply());
        totalHoldings = tokenVault.getCurrentPrice().mulDiv(totalHoldings, 10**tokenVault.decimals(), Math.Rounding.Down);
        string memory _nftHoldings = Utils.volumeToString(totalHoldings);

        uint256 totalEarnings = totalHoldings.mulDiv(16, 10000, Math.Rounding.Down);
        string memory _nftEarnings = Utils.volumeToString(totalEarnings);

        return ISvgManager(svgManager).generateNftSvg(
            ISvgManager.SvgParams(
                vaultInfo[0], // color
                vaultInfo[1], // name
                vaultInfo[3], // vault addr
                vaultInfo[4], // vault date
                vaultInfo[5], // apy
                vaultInfo[6], // vault volume
                vaultInfo[7], // dac name
                _nftEarnings,
                _nftHoldings
            )
        );

    }

    function tokenSvgUri(uint256 tokenId) public view override returns(string memory){
        string memory nftImage = Base64.encode(bytes(tokenInfoSvg(tokenId)));

        return string(abi.encodePacked(
            'data:image/svg+xml;base64,',
            nftImage
        ));
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {   
        IVault tokenVault = IVault(_deposits[tokenId].vault);
        string[8] memory vaultInfo = tokenVault.vaultInfo(); // vault 정보

        string memory nftName = string(abi.encodePacked(vaultInfo[1], " NFT #", Strings.toString(tokenId)));
        string memory nftDescription = string(
            abi.encodePacked(
                'Quinoa Investments NFT - managed by ', vaultInfo[7], '.', '\\n\\n',
                '\\nFund Product name: ', vaultInfo[1], '\\n',
                '\\nSince At: ', vaultInfo[4], '\\n'
            )
        );

        string memory nftExternalUrl = "https://quinoa.investments/";

        string memory uri = string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"',
                            nftName,
                            '", "description":"',
                            nftDescription,
                            '", "image": "',
                            tokenSvgUri(tokenId),
                            '", "external_url":"',
                            nftExternalUrl,
                            '", ',
                            '"attributes": [ ',
                                '{"trait_type": "Vault",  "value": "', vaultInfo[1], '"}, ',
                                '{"trait_type": "Signature-Color",  "value": "', vaultInfo[0], '"},',
                                '{"trait_type": "DAC",  "value": "', vaultInfo[7], '"}, ',
                                '{"trait_type": "Vault-Volume",  "value": "', vaultInfo[6], '"}, ',
                                '{"trait_type": "Current-APY",  "value": "', vaultInfo[5], '"}',
                            ']', 
                            '}'
                        )
                    )
                )
            )
        );

        return uri;
    }



    /*///////////////////////////////////////////////////////////////
                         Get NFT Information
    //////////////////////////////////////////////////////////////*/

    /// @dev user address - ( vault address - [tokenids..])
    mapping(address => mapping(address  => uint256[])) private _userAssets;

    function getTokenIds(address _user, address _vault) external view onlyRouter returns(uint256[] memory tokenIds){
        return _userAssets[_user][_vault];
    }

    function getQvtokenAmount(address _user, address _vault) external view returns(uint256){
        uint256[] memory tokens = _userAssets[_user][_vault];
        uint256 sum = 0;
        for(uint i=0; i<tokens.length; i++) {
            sum += _deposits[tokens[i]].qTokenAmount;
        }
        return sum;
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
    }

    function deposit (
        uint256 qTokenAmount,
        uint256 tokenId
    ) onlyRouter external
    {
        _deposits[tokenId].qTokenAmount += qTokenAmount;
    }
    
}