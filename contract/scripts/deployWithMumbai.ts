const { expect } = require("chai");
const {MerkleTree} = require("merkletreejs");
const keccak256 = require('keccak256');
import { Result } from "@ethersproject/abi";
import { BigNumber } from "ethers";
import {ethers} from "hardhat";
import { 
    Router__factory, 
    NftWrappingManager__factory, 
    VaultFactory__factory, 
    TestToken__factory, 
    NftWrappingManager, 
    Vault__factory, 
    GeneralNFT__factory, 
    GuruNFT__factory,
    IVault__factory,
    Vault,
    SVG1__factory,
    SVG2__factory,
    SVG3__factory,
    SVG4__factory,
    SVG5__factory,
    SVG6__factory,
    SVG7__factory,
    SVG8__factory,
    SVG9__factory,
    SVG10__factory,
    SvgManager__factory,
    Utils__factory
} from "../typechain-types";
import { svg } from "../typechain-types/contracts";
//import "hardhat/console.sol";

async function createMerkleRoot() {
    // get all addresses in hardhat network
  let signers: any[] = await ethers.getSigners();
  let accounts = signers.map(signer => signer.address);

  // create merekel tree
  const leafNodes = accounts.map(addr => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});

  const rootHash = merkleTree.getRoot();

  return rootHash
}

async function deployContracts(){

    const [deployer, user] = await ethers.getSigners();

    // #0. Deploy NFT Svg files
    const Svg1 = await new SVG1__factory(deployer).deploy();
    const svg1 = await Svg1.deployed();
    const Svg2 = await new SVG2__factory(deployer).deploy();
    const svg2 = await Svg2.deployed();
    const Svg3 = await new SVG3__factory(deployer).deploy();
    const svg3 = await Svg3.deployed();
    const Svg4 = await new SVG4__factory(deployer).deploy();
    const svg4 = await Svg4.deployed();
    const Svg5 = await new SVG5__factory(deployer).deploy();
    const svg5 = await Svg5.deployed();
    const Svg6 = await new SVG6__factory(deployer).deploy();
    const svg6 = await Svg6.deployed();
    const Svg7 = await new SVG7__factory(deployer).deploy();
    const svg7 = await Svg7.deployed();
    const Svg8 = await new SVG8__factory(deployer).deploy();
    const svg8 = await Svg8.deployed();
    const Svg9 = await new SVG9__factory(deployer).deploy();
    const svg9 = await Svg9.deployed();
    const Svg10 = await new SVG10__factory(deployer).deploy();
    const svg10 = await Svg10.deployed();

    const Utils = await new Utils__factory(deployer).deploy();
    const utils = await Utils.deployed();

    const addrParams = {
        svg1: svg1.address,
        svg2: svg2.address,
        svg3: svg3.address,
        svg4: svg4.address,
        svg5: svg5.address,
        svg6: svg6.address,
        svg7: svg7.address,
        svg8: svg8.address,
        svg9: svg9.address,
        svg10: svg10.address
    }
    const SvgManager = await new SvgManager__factory(deployer).deploy(addrParams);
    const svgManager = await SvgManager.deployed();

    // #1. Deploy Protocol Treasury
    const Treasury = await ethers.getContractFactory("ProtocolTreasury");
    const treausry = await Treasury.connect(deployer).deploy();
    await treausry.deployed();

    // #2. Deploy Entrance NFTs
    /// General NFT - price 1qui, fee percent 1/100
    const generalNFT = await new GeneralNFT__factory(deployer).deploy(10**5, 100, treausry.address);
    await generalNFT.deployed();
    const guruNFT = await new GuruNFT__factory(deployer).deploy(createMerkleRoot());
    await guruNFT.deployed();

    // #3. Deploy Router
    const router = await new Router__factory(deployer).deploy(treausry.address, generalNFT.address, guruNFT.address );
    await router.deployed();

    // #4. Deploy sNFT Manager
    //const nftManager = await new NftWrappingManager__factory(deployer).deploy(router.address );
    const NftManager = await ethers.getContractFactory("NftWrappingManager", {
        libraries: {
            Utils: utils.address
        }
    });
    const nftManager = await NftManager.connect(deployer).deploy(router.address, svgManager.address);
    await nftManager.deployed();

    // #5. SetNFTWrappingManager to Router
    const setNFT = await router.connect(deployer).setNFTWrappingManager(nftManager.address);
    await setNFT.wait();

    // #6. Deploy vaultFactory
    //const vaultFactory = await new VaultFactory__factory(deployer).deploy(router.address, treausry.address, svgManager.address);
    const VaultFactory = await ethers.getContractFactory("VaultFactory", {
        libraries: {
            Utils: utils.address
        }
    });
    const vaultFactory = await VaultFactory.connect(deployer).deploy(router.address, treausry.address, svgManager.address);
    await vaultFactory.deployed();

    console.log("svg1 address: ", svg1.address);
    console.log("svg2 address: ", svg2.address);
    console.log("svg3 address: ", svg3.address);
    console.log("svg4 address: ", svg4.address);
    console.log("svg5 address: ", svg5.address);
    console.log("svg6 address: ", svg6.address);
    console.log("svg7 address: ", svg7.address);
    console.log("svg8 address: ", svg8.address);
    console.log("svg9 address: ", svg9.address);
    console.log("svg10 address: ", svg10.address);
    console.log("utils address: ", utils.address);

    console.log("protocol treasury address: ", treausry.address);
    console.log("generalNFT address: ", generalNFT.address);
    console.log("guruNFT address: ", guruNFT.address);
    console.log("router address: ", router.address);
    console.log("nft manager address: ", nftManager.address);
    console.log("vault factory address: ", vaultFactory.address);

    return {deployer, 
            user,
            router,
            nftManager,
            vaultFactory,
            treausry
            };
}

// - Yield Farming USDC : 6.28% (Real) 
// - Beefy Finance
// - color #396EB0
async function vault1(deployer: any, user: any, router: any, nftManager: any, vaultFactory: any) {

    // 우선 asset token 배포
    const testToken = await new TestToken__factory(deployer).deploy("USD Coin", "USDC");
    await testToken.deployed();

    // vault 생성
    // vaultName/vaultSymbol/dacName/color/apy(apy는 그냥 임시로 param 넣어주는 것)
    const vault = await vaultFactory.connect(user).deployVault(
        ["Yield Farming USDC", "qvUSDC", "Beefy Finance", "#396EB0", "6.28"],     
        testToken.address);
    const rc = await vault.wait();
    const event = rc.events?.find((event: { event: string; }) => event.event === 'VaultDeployed');
    const [vaultAddress, , , , ,]:Result= event?.args || [];
    
    const tx = await testToken.connect(deployer).mint(user.address, "258100000000000000000000"); 
    await tx.wait();

    const approve = await testToken.connect(user).approve(router.address, 258100000000000000000000n);
    await approve.wait();

    const buy = await router.connect(user)["buy(address,uint256)"](vaultAddress, 258100000000000000000000n);
    await buy.wait(); 

    console.log('USDC test token Address: ', testToken.address);
    //console.log(await nftManager.tokenURI(0));
}

// - Recursive Lending AAVE : 4.23% (Pseudo) 
// - Quinoa DAC
// - color #DD4A48
async function vault2(deployer: any, user: any, router: any, nftManager: any, vaultFactory: any) {

    // 우선 asset token 배포
    const testToken = await new TestToken__factory(deployer).deploy("Avalanche", "AVAX");
    await testToken.deployed();

    // vault 생성
    // vaultName/vaultSymbol/dacName/color/apy(apy는 그냥 임시로 param 넣어주는 것)
    const vault = await vaultFactory.connect(user).deployVault(
        ["Recursive Lending AAVE", "qvAVAX", "Quinoa DAC", "#DD4A48", "4.23"],     
        testToken.address);
    const rc = await vault.wait();
    const event = rc.events?.find((event: { event: string; }) => event.event === 'VaultDeployed');
    const [vaultAddress, , , , ,]:Result= event?.args || [];
    
    const tx = await testToken.connect(deployer).mint(user.address, "93654000000000000000000"); 
    await tx.wait();

    const approve = await testToken.connect(user).approve(router.address, 93654000000000000000000n);
    await approve.wait();

    const buy = await router.connect(user)["buy(address,uint256)"](vaultAddress, 93654000000000000000000n);
    await buy.wait(); 

    console.log('AVAX test token Address: ', testToken.address);
    //console.log(await nftManager.tokenURI(0));
}

// - DAI Leveraged Farming : 4.19% (Pseudo) 
// - Alpha Homora
// - color #F0BB62
async function vault3(deployer: any, user: any, router: any, nftManager: any, vaultFactory: any) {

    // vault 생성
    // vaultName/vaultSymbol/dacName/color/apy(apy는 그냥 임시로 param 넣어주는 것)
    const vault = await vaultFactory.connect(user).deployVault(
        ["DAI Leveraged Farming", "qvDAI", "Alpha Homora", "#F0BB62", "4.19"],     
        "0xcB1e72786A6eb3b44C2a2429e317c8a2462CFeb1");
    const rc = await vault.wait();
    const event = rc.events?.find((event: { event: string; }) => event.event === 'VaultDeployed');
    const [vaultAddress, , , , ,]:Result= event?.args || [];

    console.log('Mumbai DAI token Address: ', "0xcB1e72786A6eb3b44C2a2429e317c8a2462CFeb1");
    //console.log(await nftManager.tokenURI(0));
    
    const vaultContract = await ethers.getContractAt("Vault", vaultAddress);
    console.log(await vaultContract.vaultSvgUri());
}

// - Defi Pulse Indexes : 0.24%
// - Defi Pulse
// - color #80558C
async function vault4(deployer: any, user: any, router: any, nftManager: any, vaultFactory: any) {

    // 우선 asset token 배포
    const testToken = await new TestToken__factory(deployer).deploy("DeFi Pulse Index", "DPI");
    await testToken.deployed();

    // vault 생성
    // vaultName/vaultSymbol/dacName/color/apy(apy는 그냥 임시로 param 넣어주는 것)
    const vault = await vaultFactory.connect(user).deployVault(
        ["Defi Pulse Indexes", "qvDFI", "Defi Pulse", "#80558C", "0.24"],     
        testToken.address);
    const rc = await vault.wait();
    const event = rc.events?.find((event: { event: string; }) => event.event === 'VaultDeployed');
    const [vaultAddress, , , , ,]:Result= event?.args || [];
    
    const tx = await testToken.connect(deployer).mint(user.address, "34504900000000000000000000"); 
    await tx.wait();

    const approve = await testToken.connect(user).approve(router.address, 34504900000000000000000000n);
    await approve.wait();

    const buy = await router.connect(user)["buy(address,uint256)"](vaultAddress, 34504900000000000000000000n);
    await buy.wait(); 

    console.log('DPI test token Address: ', testToken.address);
    //console.log(await nftManager.tokenURI(0));
}

async function main(){
    const {deployer, user, router, nftManager, vaultFactory} = await deployContracts();
    await vault3(deployer, user, router, nftManager, vaultFactory);
    await vault1(deployer, user, router, nftManager, vaultFactory);
    await vault2(deployer, user, router, nftManager, vaultFactory);
    await vault4(deployer, user, router, nftManager, vaultFactory);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
