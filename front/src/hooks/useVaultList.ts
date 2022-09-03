import {useState, useEffect} from 'react';
import {VaultFactory__factory, Vault__factory, Router__factory, NftWrappingManager__factory,} from "contract";
import {ethers} from 'ethers';
import { VaultInfo } from '../models/VaultInfo';
// import * as dotenv from "dotenv";

// dotenv.config({ path: __dirname+'../../.env' });

export const useVaultList = (currentAddress : string) => {

    const [vaults, setVaults] = useState<VaultInfo[]>([]);
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    
    const getVaultList= async() => {
        const vaultFactoryAddress :string = process.env.REACT_APP_VAULT_FACTORY_ADDRESS || "";
        if (vaults.length > 0) return 
        const vaultFactory = VaultFactory__factory.connect(vaultFactoryAddress, provider);
        const router = Router__factory.connect(
            process.env.REACT_APP_ROUTER_ADDRESS || "", signer
        )
        const nftManager = NftWrappingManager__factory.connect(
            process.env.REACT_APP_NFT_MANAGER_ADDRESS || "", provider
        )
        const vaultList = await vaultFactory.getVault();
        for(let i=0; i<vaultList.length ; i++) {
            const vault = Vault__factory.connect(vaultList[i], provider);
            const [ , name, symbol, address, date, apy, totalVolume, dacName] = await vault.vaultInfo();
            const tokens = await router.getNfts(vaultList[i]);
            if (tokens.length > 0 ) {
                const [nftSvg, totalAssets, asset, tokenId] = await Promise.all([nftManager.tokenSvgUri(tokens[0]), vault.totalAssets(), vault.asset(), tokens[0]]);
                setVaults((prev) => [
                    ...prev,{
                        address:address, 
                        asset:asset,
                        name:name, 
                        symbol:symbol, 
                        totalAssets:totalAssets, 
                        totalVolume:totalVolume, 
                        dacName:dacName,
                        date: date,
                        apy: apy,
                        nftSvg: nftSvg,
                        tokenId : tokenId
                     }]);
                
            }
            else {
                const [svg, totalAssets, asset] = await Promise.all([vault.vaultSvgUri(), vault.totalAssets(),  vault.asset()]);
                setVaults((perv) => [
                    ...perv, {
                        address: address, 
                        asset: asset, 
                        name: name, 
                        symbol: symbol, 
                        totalAssets : totalAssets, 
                        totalVolume: totalVolume, 
                        vaultSvg : svg, 
                        dacName: dacName, 
                        date: date, 
                        apy: apy}]);
            }
        }    
    }
    useEffect(()=> {
        getVaultList();
    }, [])
    return vaults;

}