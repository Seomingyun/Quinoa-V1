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
    Qui__factory
} from "../typechain-types";
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
    const nftManager = await new NftWrappingManager__factory(deployer).deploy(router.address);
    await nftManager.deployed();
    console.log("NFT Manager address", nftManager.address);

    // #5. SetNFTWrappingManager to Router
    const setNFT = await router.connect(deployer).setNFTWrappingManager(nftManager.address);
    await setNFT.wait();

    // #6. Deploy vaultFactory
    const vaultFactory = await new VaultFactory__factory(deployer).deploy(router.address, treausry.address);
    await vaultFactory.deployed();
    console.log("Vault Factory address", vaultFactory.address);

    // #7. Deploy testToken and Deploy Vault through vaultFactory  X 5
    const testToken = await new TestToken__factory(deployer).deploy();
    await testToken.deployed();
    console.log("TestToken address", testToken.address);

    for(let i=0; i <5; i++ ) {
      const tx = await vaultFactory.connect(user).deployVault(testToken.address);
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
