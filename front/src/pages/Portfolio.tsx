import { useNftInfo } from "../hooks/useNftInfo"
import "./Portfolio.css"
import { NftInfo } from "../models/NftInfo";
import {useSell} from "../hooks/useSell";

function Portfolio () {
    const tokenList = useNftInfo();
    console.log(tokenList);
    const {sell} = useSell();
    return(
    <div className="myinvest_banner">
        {tokenList.map((item: NftInfo) => (
            <>
            <div> Vault : {item.vault} </div>
            <div>Token id : {Number(item.tokenId)}</div>
            <button type="button" onClick={() => sell(Number(item.tokenId))}>sell</button>
            </>
        ))}
    </div>
    )
}

export default Portfolio;