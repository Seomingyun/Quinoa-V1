import { AvailableInfo } from "../models/AvailableInfo"
import { useEffect, useState } from "react";
import {ethers, utils} from 'ethers';
import { VaultInfo } from "../models/VaultInfo";
import { Router__factory, VaultFactory__factory, Vault__factory, ERC20__factory } from "contract";

export const useAvailableInfo = (currentAddress:string, vaultInfo: VaultInfo) => {
    const [available, setAvailable] = useState<AvailableInfo>();
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const getAvailableInfo = async(currentAddress:string, vaultInfo: VaultInfo) => {
        const routerAddress = process.env.REACT_APP_ROUTER_ADDRESS || "";
        const router = Router__factory.connect(routerAddress, signer);

        const {asset, amount} = await router.getHoldingAssetAmount(vaultInfo.address);
        
        const baseAsset = ERC20__factory.connect(asset, provider);
        const balance = await baseAsset.balanceOf(currentAddress);

        setAvailable({availableSaleAmount:Number(ethers.utils.formatEther(amount)), 
            availableBuyAmount: Number(ethers.utils.formatEther(balance))});
        
    }
    useEffect(() => {
        getAvailableInfo(currentAddress, vaultInfo);
    }, [currentAddress, vaultInfo]);
    return available;

    
}