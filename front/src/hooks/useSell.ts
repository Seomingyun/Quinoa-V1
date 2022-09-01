import { Router__factory } from "contract";
import { useCallback, useMemo, useState, useEffect } from "react"
import {BigNumber, ethers} from 'ethers';
import { VaultInfo } from "../models/VaultInfo";

export const useSell = (vaultInfo : VaultInfo) => {
    const {ethereum} =window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = useMemo(()=>provider?.getSigner(), [provider]);
    const [sellTxStatus, setSellTxStatus] = useState<string>("default");

    const sell = useCallback(
        async(amount:string) => {
            const routerAddress:string = process.env.REACT_APP_ROUTER_ADDRESS || ""
            const router = Router__factory.connect(routerAddress, signer);

            // Assume person owns only one nft per vault
            const tokenId = (await router.getNfts(vaultInfo.address))[0];
            try{
                const sellTx = await router.sell(tokenId, ethers.utils.parseUnits(amount));
                setSellTxStatus(sellTx.blockHash === null ? "pending" : "error");
                const receipt = await sellTx.wait();
                setSellTxStatus(!!receipt.blockHash ? "success" : "error" );
                console.log("sell!");
            }catch(e){
                console.log(e);
                setSellTxStatus("error");
            }

        }, []);
        useEffect(()=>{
            if(sellTxStatus === "error"){
                setTimeout(()=>{
                    setSellTxStatus("default")
                   }, 8000)
            }
            else if (sellTxStatus === "success"){
                setTimeout(()=>{
                    setSellTxStatus("default")
                   }, 4000)
            }
        },[sellTxStatus]);
        return {sell, sellTxStatus};
};