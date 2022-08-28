import {ethers, BigNumber} from 'ethers';
import { useCallback, useMemo } from 'react';
import { Router__factory, ERC20__factory, TestToken__factory } from 'contract';
import { text } from 'stream/consumers';

export const useBuy = (amount:string, address:any, assetAddress:any, currentAddress:any) => {
    const {ethereum} =window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = useMemo(()=>provider?.getSigner(), [provider]);

    const buy = useCallback(
        async(amount:string, currentAddress:any, address:any, assetAddress:string, ) => {
            
            const routerAddress:string = process.env.REACT_APP_ROUTER_ADDRESS || ""
            const router = Router__factory.connect(routerAddress, signer);
            
            //**Testtoken minting just for testing **
            // const testToken = TestToken__factory.connect(assetAddress, signer);
            // const mintTx = await testToken.mint(currentAddress, ethers.utils.parseUnits("10000"));
            // await mintTx.wait();
            // console.log("minted!");
            const asset = ERC20__factory.connect(assetAddress, signer);
            await asset.approve(router.address, ethers.utils.parseUnits(amount));
            const buyTx = await router['buy(address,uint256)'](address, ethers.utils.parseUnits(amount));
            await buyTx.wait();
            console.log("buy!");

        }, [amount, address, assetAddress, currentAddress]);
  
    return {buy}
};