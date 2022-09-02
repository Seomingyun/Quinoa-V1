import data from "./TokenIdMapper.json"
import axios from "axios"


export const PriceConversion = async (symbol:string, amount:number) => {
    const token = data.filter(obj => {
        return obj.symbol === symbol
    });
    /// token that cannot track price assumes 1Dollar per token
    if (token.length===0 || amount === 0) return amount;
    const baseUrl = 'api/v2/tools/price-conversion'
    let price = 0;
    await axios.get(
        baseUrl, {
            headers: {
                "X-CMC_PRO_API_KEY": process.env.REACT_APP_COINMARKETCAP_API_KEY||""
            },
            params : {
                amount : amount,
                id : token[0].id
            }
        }
    )
    .then(response => {
        price = response.data.data.quote.USD.price
    })
    .catch(error => {
        console.error(error);
    })
    return price
}