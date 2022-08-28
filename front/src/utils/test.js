import data from "./input.json" assert {type:"json"};
import axios from "axios"

const getOne = data.filter(obj => {
    return obj.symbol === "MATIC"
});

// console.log(getOne[0].id);
console.log(getOne);
const  baseUrl= "https://pro-api.coinmarketcap.com/v2/tools/price-conversion"
async function getData(amount) {
    try{
        const response = await axios.get(
            baseUrl, {
                headers: {
                    "X-CMC_PRO_API_KEY": "496b4ddf-0641-4b7e-a16e-39acb343a41e"
                },
                parmas : {
                    amount : amount,
                    id : getOne[0].id
                }
            }
        )
    } catch (error){
        console.error(error);
    }
}

getData(10.43);