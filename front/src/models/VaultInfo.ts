import {BigNumberish} from 'ethers';

export interface VaultInfo {
    address: String,
    asset : String,
    name : String,
    symbol : String,
    totalAssets : BigNumberish,
    totlaAssetsInDollar? : BigNumberish,
}

