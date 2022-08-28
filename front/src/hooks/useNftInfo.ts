import { useState, useEffect } from "react";
import { NftInfo } from "../models/NftInfo"
import {ethers} from 'ethers';
import { Router__factory, VaultFactory__factory, Vault__factory } from "contract";
import {BigNumber} from 'ethers';
import { VaultInfo } from "../models/VaultInfo";

export const useNftInfo = () => {
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
            const nftList: BigNumber[] = await router.getNfts(vaultList[i]);
            const vault = Vault__factory.connect(vaultList[i], provider);
            const [vaultName, asset] = await Promise.all([vault.name(), vault.asset()]);
            //console.log("vault", vaultList[i], nftList);
            const info : NftInfo[] = nftList.map(item => <NftInfo>{vault: vaultList[i], vaultName: vaultName, tokenId: item, asset:asset});
            setNfts((prev) => [...prev, ...info]);
        }
    }

    useEffect(()=> {
        getNftList();
    }, [])
    return nfts;
}