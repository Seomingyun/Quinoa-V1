const { expect } = require("chai");
const {MerkleTree} = require("merkletreejs");
const keccak256 = require('keccak256');
import { Result } from "@ethersproject/abi";
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

async function deployContracts(){

    const [deployer, user] = await ethers.getSigners();

    // #1. Deploy Protocol Treasury
    const Treasury = await ethers.getContractFactory("ProtocolTreasury");
    const treausry = await Treasury.connect(deployer).deploy();
    await treausry.deployed();

    // #2. Deploy Entrance NFTs
    /// General NFT - price 1qui, fee percent 1/100
    const generalNFT = await new GeneralNFT__factory(deployer).deploy(10**5, 100, treausry.address);
    await generalNFT.deployed();
    const gurulNFT = await new GuruNFT__factory(deployer).deploy(createMerkleRoot());
    await gurulNFT.deployed();

    // #3. Deploy Router
    const router = await new Router__factory(deployer).deploy(treausry.address, generalNFT.address, gurulNFT.address );
    await router.deployed();

    // #4. Deploy NFT Manager
    const nftManager = await new NftWrappingManager__factory(deployer).deploy(router.address);
    await nftManager.deployed();

    // #5. SetNFTWrappingManager to Router
    const setNFT = await router.connect(deployer).setNFTWrappingManager(nftManager.address);
    await setNFT.wait();

    // #6. Deploy vaultFactory
    const vaultFactory = await new VaultFactory__factory(deployer).deploy(router.address, treausry.address);
    await vaultFactory.deployed();

    // #7. Deploy testToken and Deploy Vault through vaultFactory
    const testToken = await new TestToken__factory(deployer).deploy();
    await testToken.deployed();
    const tx = await vaultFactory.connect(user).deployVault(testToken.address);
    const rc = await tx.wait();
    const event = rc.events?.find(event => event.event === 'VaultDeployed');
    const [vaultAddress, , , , ,]:Result= event?.args || [];

    return {deployer, 
            user,
            router,
            testToken,
            nftManager,
            vaultFactory,
            vaultAddress };
}

// describe("Buy", async() => {
//     const {deployer, user, router, nftManager, vaultFactory, vaultAddress}  = await deployContracts();
// })

describe("VaultDeployment",() => {

    it("Should return vault address that was deployed", async () => {
        const {vaultFactory, vaultAddress} = await deployContracts();
        const get_vault = (await vaultFactory.getVault());
        console.log(get_vault);
        expect (get_vault[0]).to.equal(vaultAddress);
    });

    it("Should return 1 for vaults list length", async () => {
        const {vaultFactory}  = await deployContracts();
        const len = (await vaultFactory.getVault()).length;
        expect(len).to.equal(1);
    });
    

});

describe("Buy fund NFT", () => {
    it("Should mint fund NFT", async() => {
        const {deployer, user, router, testToken, nftManager, vaultAddress} = await deployContracts();
        const tx = await testToken.connect(deployer).mint(user.address, 10**5); 
        await tx.wait();
        expect(testToken.balanceOf(user.address)).to.equal(10**5);

        const buy = await router.connect(user).buy(vaultAddress, 10**2);
        await buy.wait(); 

        expect(nftManager.balanceOf(user.address)).to.equal(1);
    });
});