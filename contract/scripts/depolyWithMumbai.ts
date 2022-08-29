const {MerkleTree} = require("merkletreejs");
const keccak256 = require('keccak256');
import { Result } from "@ethersproject/abi";
import {ethers} from "hardhat";
import { 
    Router__factory, 
    NftWrappingManager__factory, 
    VaultFactory__factory, 
    TestToken__factory, 
    GeneralNFT__factory, 
    GuruNFT__factory,
} from "../typechain-types";

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
    const treasury = await Treasury.connect(deployer).deploy();
    await treasury.deployed();

    // #2. Deploy Entrance NFTs
    /// General NFT - price 1qui, fee percent 1/100
    const generalNFT = await new GeneralNFT__factory(deployer).deploy(10**5, 100, treasury.address);
    await generalNFT.deployed();
    const gurulNFT = await new GuruNFT__factory(deployer).deploy(createMerkleRoot());
    await gurulNFT.deployed();

    // #3. Deploy Router
    const router = await new Router__factory(deployer).deploy(treasury.address, generalNFT.address, gurulNFT.address );
    await router.deployed();

    // #4. Deploy sNFT Manager
    const nftManager = await new NftWrappingManager__factory(deployer).deploy(router.address);
    await nftManager.deployed();

    // #5. SetNFTWrappingManager to Router
    const setNFT = await router.connect(deployer).setNFTWrappingManager(nftManager.address);
    await setNFT.wait();

    // #6. Deploy vaultFactory
    const vaultFactory = await new VaultFactory__factory(deployer).deploy(router.address, treasury.address);
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
            vaultAddress,
            treasury
            };
}

// Buy logic
async function main(){
    const {deployer, user, router, testToken, nftManager, vaultAddress, treasury}
            = await deployContracts();
    
    const tx = await testToken.connect(deployer).mint(user.address, "100000"); 
    await tx.wait();

    const approve = await testToken.connect(user).approve(router.address, await testToken.balanceOf(user.address));
    await approve.wait();
    const buy = await router.connect(user)["buy(address,uint256)"](vaultAddress, 10**2);
    await buy.wait(); 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
