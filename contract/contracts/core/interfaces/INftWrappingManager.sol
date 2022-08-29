//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface INFTWrappingManager is IERC721 {

    function withdraw (uint256 tokenId, address vault, uint256 amount) external;

    function depositInfo(uint tokenId) external view
        returns (
            address vault,
            uint256 qvTokenAmount,
            bool isFullyRedeemed
        );

    function deposit (address user, address vault, uint256 qvTokenAmount) external;

    function deposit (uint256 qvTokenAmount, uint256 tokenId) external;

    function getTokenIds(address _user, address _vault) external view returns(uint256[] memory  tokenIds);

    function getQvtokenAmount(address _user, address _vault) external view returns(uint256);

}