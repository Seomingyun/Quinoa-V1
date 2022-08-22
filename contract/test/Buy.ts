const { expect } = require("chai");
import {ethers} from "hardhat";
import { Router__factory, NftWrappingManager__factory, VaultFactory__factory, TestToken__factory, ERC20, NftWrappingManager, Vault__factory } from "../typechain-types";
//import "hardhat/console.sol";

async function deployContracts()
    {
    const [deployer, user] = await ethers.getSigners();
    //console.log(deployer.address);
    const router = await new Router__factory(deployer).deploy();
    await router.deployed();

    // const nftManager = await new NftWrappingManager__factory(deployer).deploy(router.address);
    // await nftManager.deployed();

    const vaultFactory = await new VaultFactory__factory(deployer).deploy(router.address);
    await vaultFactory.deployed();

    // const testToken = await new TestToken__factory(deployer).deploy();
    // await testToken.deployed();

    //const vault = await new Vault__factory(deployer).deploy(testToken.address, user.address, router.address);

    //const vaultAddress = await vaultFactory.connect(user).deployVault(testToken.address);

    return {deployer, router, vaultFactory};
    // return {deployer, 
    //         user,
    //         router,
    //         nftManager,}
            //vaultFactory,};
            //vaultAddress };
}

// describe("Buy", async() => {
//     const {deployer, user, router, nftManager, vaultFactory, vaultAddress}  = await deployContracts();
// })

describe("VaultDeployment", async () => {

    // it("Should return vault address that was deployed", async () => {
    //     const {vaultFactory} = await  ddeployContracts();
    //     const get_vault = (await vaultFactory.getVault())[0];
    //     expect (get_vault).to.equal(vaultAddress);
    // });

    // it("Should return 1 for vaults list length", async () => {
    //     const {vaultFactory}  = await deployContracts();
    //     const len = (await vaultFactory.getVault()).length;
    //     expect(len).to.equal(0);
    // });

    it("Deploy", async () =>{
        const {deployer} = await deployContracts();
    })

});