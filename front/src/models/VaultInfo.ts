import {BigNumberish} from 'ethers';

export interface VaultInfo {
    address: string,
    asset : string,
    name : string,
    symbol : string,
    totalAssets : BigNumberish,
    totalVolume : string,
    svg : string ,
    dacName : string,
    date : string,
    apy : string
}

