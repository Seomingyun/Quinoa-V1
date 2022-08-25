import {BigNumberish} from 'ethers';

export interface VaultInfo {
    name : String,
    symbol : String,
    totalAssets : BigNumberish,
    totlaAssetsInDollar? : BigNumberish,
}

