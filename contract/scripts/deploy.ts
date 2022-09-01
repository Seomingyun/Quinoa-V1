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
    GeneralNFT__factory, 
    GuruNFT__factory,
    Qui__factory,
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

async function main(){

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
    console.log("Protocol Treasury address", treausry.address);

    // #2. Deploy Entrance NFTs
    /// General NFT - price 1qui, fee percent 1/100
    const generalNFT = await new GeneralNFT__factory(deployer).deploy(10**5, 100, treausry.address);
    await generalNFT.deployed();
    console.log("General NFT address", generalNFT.address);
    const gurulNFT = await new GuruNFT__factory(deployer).deploy(createMerkleRoot());
    await gurulNFT.deployed();
    console.log("Guru NFT address", gurulNFT.address);

    // #3. Deploy Router
    const router = await new Router__factory(deployer).deploy(treausry.address, generalNFT.address, gurulNFT.address );
    await router.deployed();
    console.log("Router address", router.address);

    // #4. Deploy sNFT Manager
    const NftManager = await ethers.getContractFactory("NftWrappingManager", {
      libraries: {
        Utils: utils.address
      }
    });
    const nftManager = await NftManager.connect(deployer).deploy(router.address, svgManager.address);
    await nftManager.deployed();
    console.log("NFT Manager address", nftManager.address);

    // #5. SetNFTWrappingManager to Router
    const setNFT = await router.connect(deployer).setNFTWrappingManager(nftManager.address);
    await setNFT.wait();

    // #6. Deploy vaultFactory
    const VaultFactory = await ethers.getContractFactory("VaultFactory", {
      libraries: {
          Utils: utils.address
      }
    });
    const vaultFactory = await VaultFactory.connect(deployer).deploy(router.address, treausry.address, svgManager.address);
    await vaultFactory.deployed();
    console.log("Vault Factory address", vaultFactory.address);

    // #7. Deploy testToken and Deploy Vault through vaultFactory  X 5
    const testToken = await new TestToken__factory(deployer).deploy();
    await testToken.deployed();
    console.log("TestToken address", testToken.address);

    const colors= ["#2097F6", "#93C69B","#F5CB35", "#FF5A43", "#5452F6"];
    for(let i=0; i <5; i++ ) {
      const tx = await vaultFactory.connect(user).deployVault(
        ["JENN Yeild Product", "JENN", "JENN", colors[i], "5.12"],     // vaultName/vaultSymbol/dacName/color/apy(apy는 그냥 임시로 param 넣어주는 것)
        testToken.address);
      await tx.wait();
    }

    //#8. Deploy Qui Token
    const qui = await new Qui__factory(deployer).deploy(10, createMerkleRoot());
    await qui.deployed();
    console.log("QuiToken address", qui.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
