import {useState, useEffect} from 'react';
import {VaultFactory__factory} from "contract";
import {ethers} from 'ethers';

export const useVaultList = () => {

    const [vaultList, setVaultList] = useState<String[]>();
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const getVaultList= async() => {
        const vaultFactoryAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
        // const signer = provider.getSigner(currentAccount);
        const vaultFactory = await VaultFactory__factory.connect(vaultFactoryAddress, provider);
        const vault = await vaultFactory.getVault();
        setVaultList(vault); 
    };

    useEffect(()=> {
        getVaultList();
    }, [])
    return vaultList;

}