import {BigNumber} from 'ethers';
import { VaultInfo } from './VaultInfo';
export interface NftInfo {
    vaultInfo : VaultInfo,
    tokenId : BigNumber,
    nftSvg : string
}