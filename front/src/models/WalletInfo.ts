import {BigNumber} from 'ethers';

export interface WalletInfo {
    symbol : string,
    balance : number,
    amount : number,
    logo? : string
}