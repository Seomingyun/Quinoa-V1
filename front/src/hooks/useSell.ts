import { Router__factory } from "contract";
import { useCallback, useMemo } from "react"
import {BigNumber, ethers} from 'ethers';
export const useSell = () => {
    const {ethereum} =window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = useMemo(()=>provider?.getSigner(), [provider]);

    const sell = useCallback(
        async(tokenId:number) => {
            const routerAddress:string = process.env.REACT_APP_ROUTER_ADDRESS || ""
            const router = Router__factory.connect(routerAddress, signer);
            // FIX!! : amount to sell is hardcoded.
            const sellTx = await router.sell(tokenId, 50);
            await sellTx.wait();
            console.log("sell!");
        }, []);
    return {sell}
};