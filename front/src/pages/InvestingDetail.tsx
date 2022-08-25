import React, { useState } from "react";
import "./InvestingDetail.css";
import { useBuy } from "../hooks/useBuy";
import { Link , useLocation, useParams} from "react-router-dom";



interface RouteState {
  state: {
    assetAddress: string;
  };
}

function InvestingDetail({currentAccount}:any) {
  const {address} = useParams();
  console.log(address);

  const {state} = useLocation() as RouteState;

  const [amount,setAmount] = useState(0);
  const {buy} = useBuy(amount, currentAccount, address, state.assetAddress);
  const handleChange= (e:any) => {
    setAmount(e.target.value);
  }

  // const buy = () => {
    
  // }
  const sell = () =>{
      
  }
  return (
  <div className="myinvest_banner">
    <input type="text" name="buyAmount" placeholder="Enter amount to buy" value={amount.toString()} onChange={handleChange}></input>
    <button type="button" onClick={() => buy(amount, currentAccount, address, state.assetAddress)}>buy</button>
    <button type="button" onClick={sell}>sell</button>
  </div>
  )

}

export default InvestingDetail;
