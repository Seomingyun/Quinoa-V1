import { useState, useEffect } from "react";
import { NftInfo } from "../models/NftInfo"
import {ethers} from 'ethers';
import { NftWrappingManager__factory, Router__factory, VaultFactory__factory, Vault__factory } from "contract";
import {BigNumber} from 'ethers';
import { VaultInfo } from "../models/VaultInfo";

export const useNftInfo = (currenctAccount:string) => {
    const [nfts, setNfts] = useState<NftInfo[]>([]);
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const getNftList = async() => {
        if (nfts.length > 0 ) return
        const vaultFactoryAddress :string = process.env.REACT_APP_VAULT_FACTORY_ADDRESS || "";
        const vaultFactory = VaultFactory__factory.connect(vaultFactoryAddress, provider);
        const vaultList = await vaultFactory.getVault();

        const routerAddress = process.env.REACT_APP_ROUTER_ADDRESS || "";
        const router = Router__factory.connect(routerAddress, signer);
        for(let i =0; i<vaultList.length; i++) {
            const tokenList: BigNumber[] = await router.getNfts(vaultList[i]);
            console.log (tokenList);
            const vault = Vault__factory.connect(vaultList[i], provider);
            const nftManager = NftWrappingManager__factory.connect(
                // CHECK .ENV 
                process.env.REACT_APP_NFT_MANAGER_ADDRESS || "", provider);
            const [ , name, symbol, address, date, apy, totalVolume, dacName] = await vault.vaultInfo(); 
            const [vaultSvg, totalAssets, asset] = await Promise.all([vault.vaultSvgUri(), vault.totalAssets(),  vault.asset()]);

            const info : NftInfo[] = await Promise.all(tokenList.map(async (item) => <NftInfo> {
                vaultInfo: {address, asset, name, symbol, totalAssets, totalVolume, svg:vaultSvg, dacName, date, apy},
                tokenId : item,
                nftSvg : await nftManager.tokenSvgUri(item)
            }))
    
            setNfts((prev) => [...prev, ...info]);
            
        }
        console.log(nfts)
    }

    useEffect(()=> {
        getNftList();
    }, [])
    return nfts;
}