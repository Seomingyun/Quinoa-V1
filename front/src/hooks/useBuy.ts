import {ethers, BigNumber} from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Router__factory, ERC20__factory, TestToken__factory } from 'contract';
import { text } from 'stream/consumers';

export const useBuy = (amount:string, address:any, assetAddress:any, currentAddress:any, tokenId?:BigNumber) => {
    const {ethereum} =window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = useMemo(()=>provider?.getSigner(), [provider]);
    const [txStatus, setTxStatus] = useState<string>("default");

    const buy = useCallback(
        async(amount:string, currentAddress:any, address:any, assetAddress:string, ) => {

            const routerAddress:string = process.env.REACT_APP_ROUTER_ADDRESS || ""
            const router = Router__factory.connect(routerAddress, signer);
            
            //**Testtoken minting just for testing **
            const testToken = TestToken__factory.connect(assetAddress, signer);
            try{
                const mintTx = await testToken.mint(currentAddress, ethers.utils.parseUnits("100"));
                console.log(mintTx);
                await mintTx.wait();
                console.log("token Minted");

                const asset = ERC20__factory.connect(assetAddress, signer);
                setTxStatus(mintTx.blockHash === null ? "pending" : "error");
                const approveTx = await asset.approve(router.address, ethers.utils.parseUnits(amount));
                await approveTx.wait();
                if(!!tokenId) // 추가 구매
                {
                    const buyTx = await router['buy(uint256,uint256)'](ethers.utils.parseUnits(amount), tokenId);
                    const receipt = await buyTx.wait();
                    console.log("buy!");
                    setTxStatus(!!receipt.blockHash ? "success" : "error" );
                }else { // 새롭게 구매
                    const buyTx = await router['buy(address,uint256)'](address, ethers.utils.parseUnits(amount));
                    const receipt = await buyTx.wait();
                    console.log("buy!");
                    setTxStatus(!!receipt.blockHash ? "success" : "error" );
                
                }
                

            } catch(e) {
                console.log(e);
                setTxStatus("error");
            }

        }, [amount, address, assetAddress, currentAddress, tokenId]);

    useEffect(()=>{
        if(txStatus === "error"){
            setTimeout(()=>{
                setTxStatus("default")
               }, 8000)
        }
        else if (txStatus === "success"){
            setTimeout(()=>{
                setTxStatus("default")
               }, 4000)
        }
    },[txStatus]);
    return {buy, txStatus};
};