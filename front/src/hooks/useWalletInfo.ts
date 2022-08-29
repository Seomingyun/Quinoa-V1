import { useEffect, useState } from "react"
import data from "../utils/TokenAddressMapper.json";
import { ERC20__factory } from "contract";
import {ethers} from "ethers";
import { WalletInfo } from "../models/WalletInfo";
import { PriceConversion } from "../utils/PriceConversion";

export const useWalletInfo = (currentAddress : string) => {
    const [walletInfo, setWalletInfo] = useState<WalletInfo[]>([]);
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const getWalletInfo = async(currentAddress:string) => {
        if (walletInfo.length > 0) return
        data.map(async (item) => {
            const token = ERC20__factory.connect(item.address, provider);
            const tokenBalance = await token.balanceOf(currentAddress);
            const amount =  Number(ethers.utils.formatEther(tokenBalance));
            const logo = item.logo;
            if (Number(tokenBalance) > 0 ) {
                const balance = await PriceConversion(item.symbol, amount);
                setWalletInfo((prev) => [...prev, {symbol: item.symbol, balance, amount, logo}]);
            }
        })    
    } 
    useEffect(() => {
        getWalletInfo(currentAddress);
    },[currentAddress])
    return walletInfo;
}