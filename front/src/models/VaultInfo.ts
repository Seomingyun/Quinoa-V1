import {BigNumberish, BigNumber} from 'ethers';

export interface VaultInfo {
    address: string,
    asset : string,
    name : string,
    symbol : string,
    totalAssets : BigNumberish,
    totalVolume : string,
    vaultSvg? : string ,
    dacName : string,
    date : string,
    apy : string
    nftSvg? :string,
    tokenId? :BigNumber
}

