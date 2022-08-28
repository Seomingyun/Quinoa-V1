import {BigNumber} from 'ethers';

export interface NftInfo {
    vault : String,
    vaultName:String,
    tokenId : BigNumber,
    asset : String
}