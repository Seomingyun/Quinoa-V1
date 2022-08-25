import {useState, useEffect} from 'react';
import {VaultFactory__factory, Vault__factory, ERC20, ERC20__factory} from "contract";
import {ethers} from 'ethers';
import { VaultInfo } from '../models/VaultInfo';
export const useVaultList = () => {

    const [vaults, setVaults] = useState<VaultInfo[]>([]);
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    
    const getVaultList= async() => {
        const vaultFactoryAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
        if (vaults.length > 0) return 
        const vaultFactory = VaultFactory__factory.connect(vaultFactoryAddress, provider);
        const vaultList = await vaultFactory.getVault();
        for(let i=0; i<vaultList.length ; i++) {
            const vault = Vault__factory.connect(vaultList[i], provider);
            const [name, totalAssets, asset] = await Promise.all([vault.name(), vault.totalAssets(),  vault.asset()]);
            const baseAsset = ERC20__factory.connect(asset, provider);
            const symbol = await baseAsset.symbol();
            setVaults((perv) => [...perv, {name, totalAssets, symbol}]);
            }
    }

    useEffect(()=> {
        getVaultList();
    }, [])
    return vaults;

}