import { useState, useEffect } from "react";
import { Router__factory, NftWrappingManager__factory } from "contract";
import {ethers} from 'ethers';
import {BigNumber} from 'ethers';

export const useDepositInfo = (currentAddress:string, vaultAddress:string) => {
    const [deposit, setDeposit] = useState<number>(0);
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const routerAddress = process.env.REACT_APP_ROUTER_ADDRESS || "";
    const router = Router__factory.connect(routerAddress, signer);

    const nftManager = NftWrappingManager__factory.connect(
        process.env.REACT_NFT_MANAGER_ADDRESS|| "", provider);
    
    const getDepositInfo = async() => {
        const nftList: BigNumber[] = await router.getNfts(vaultAddress);
        console.log(nftList);
        const depositAmount = await nftManager.getQtokenAmount(nftList[0]);
        // for(let i=0; i<nftList.length; i++) {
        //     console.log("qvtoken : ",Number(await nftManager.getQtokenAmount(nftList[i])));
        // }
        console.log(depositAmount);
        setDeposit(Number(depositAmount));
    }

    useEffect(()=> {
        getDepositInfo();
    }, [vaultAddress])
    // string
    return deposit;

}