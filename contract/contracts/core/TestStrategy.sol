// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {BeefyZapUniswapV2} from "./BeefyZapUniswapV2.sol";
import {IVault} from "./interfaces/IVault.sol";
import {Strategy, ERC20Strategy} from "./Strategy.sol";

contract StrategyQuickSwapMaticMaticX is ERC20Strategy {
    using SafeERC20 for ERC20;
    // internal
    address public vaultAddress;
    ERC20 UNDERLYING;

    address public wmatic = address(0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270);
    // address public maticX = address(0xfa68FB4628DFF1028CFEc22b4162FCcd0d45efb6); // Liquid Staking Matic (PoS) (MaticX)
    // address public matic_maticX = address(0xb0e69f24982791dd49e316313fD3A791020B8bF7); // uniswapV2 LP(QuickSwap) - matic maticX
    address payable  beefyZap = payable(0x540A9f99bB730631BF243a34B19fd00BA8CF315C);

    BeefyZapUniswapV2 beefyUniV2Zap = BeefyZapUniswapV2(beefyZap);
    address public beefyQuickMaticMaticXPoolVault = address(0xa448e9833095ad50693B025c275F48b271aDe882);


    
    constructor(address _UNDERLYING_ADDRESS) ERC20("StrategyQuickSwapMaticMaticX", "QSMMX") {
        // vaultAddress = _vaultAddress;
        UNDERLYING = ERC20(_UNDERLYING_ADDRESS);
        // require(IVault(_vault).asset() == matic_maticX, "Underlying mismatch");
    }

    // function deposit(uint256 amount) public {
    //     require(token.balanceOf(address(vaultAddress)));
    // }

    function isCEther() external pure override returns (bool) {
        return false;
    }

    function underlying() external view override returns (ERC20) {
        return UNDERLYING;
    }

    function mint(uint256 amount) external override returns (uint256) {
        // _mint(msg.sender, amount.mulDivDown(BASE_UNIT, exchangeRate()));

        UNDERLYING.safeTransferFrom(msg.sender, address(this), amount);
        beefyUniV2Zap.beefIn(beefyQuickMaticMaticXPoolVault, amount/2, wmatic, amount);
        return 0;
    }

    function redeemUnderlying(uint256 amount) external override returns (uint256) {
        require(amount <= UNDERLYING.balanceOf(address(this)));

        UNDERLYING.safeTransfer(msg.sender, amount);

        return 0;
    }


    function balanceOfUnderlying(address) external view override returns (uint256) {
        return UNDERLYING.balanceOf(address(this));
    }
}
