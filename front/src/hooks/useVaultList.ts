import {useState, useEffect} from 'react';
import {VaultFactory__factory} from "contract";
import {ethers} from 'ethers';

export const useVaultList = async () => {

    const vaultFactoryAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508";
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    // const signer = provider.getSigner(currentAccount);
    const vaultFactory = VaultFactory__factory.connect(vaultFactoryAddress, provider);
    const vault = await vaultFactory.getVault();

    return vault;

}