import { useState, useEffect } from "react";
import { NftInfo } from "../models/NftInfo"
import {ethers, utils} from 'ethers';
import { Router__factory, VaultFactory__factory, Vault__factory, ERC20__factory } from "contract";
import {BigNumber} from 'ethers';
import { HoldingInfo } from "../models/HolindgInfo";
import { getEmitHelpers } from "typescript";

export const useHoldingInfo = (currentAddress:string) => {
    const [holdingInfo, setHoldingInfo] = useState<HoldingInfo>();
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const getHoldingInfo = async(currentAddress:string) => {

        const vaultFactoryAddress :string = process.env.REACT_APP_VAULT_FACTORY_ADDRESS || "";
        const vaultFactory = VaultFactory__factory.connect(vaultFactoryAddress, provider);
        const vaultList = await vaultFactory.getVault();

        const routerAddress = process.env.REACT_APP_ROUTER_ADDRESS || "";
        const router = Router__factory.connect(routerAddress, signer);
        let totalHoldings = 0;
        for(let i =0; i<vaultList.length; i++) {
            const {asset,amount} = await router.getHoldingAssetAmount(vaultList[i]);
            const vault = Vault__factory.connect(vaultList[i], provider);
            // TODO: asset 의 달러 값 불러오기 (api fetch). 임시로 1000이라 함. 
            const inDollar = 1000;
            totalHoldings += Number(ethers.utils.formatEther(amount)) * inDollar;
        }
        const qui = ERC20__factory.connect(process.env.REACT_APP_QUI_ADDRESS||"", provider);
        const quiTokens = Number(ethers.utils.formatEther(await qui.balanceOf(currentAddress)));
        setHoldingInfo({totalHoldings, quiTokens});
        
    }

    useEffect(()=> {
        getHoldingInfo(currentAddress);
    }, [currentAddress])
    return holdingInfo;
}