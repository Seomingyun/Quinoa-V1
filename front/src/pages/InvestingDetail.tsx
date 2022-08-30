import React, { useEffect, useState } from "react";
import "./InvestingDetail.css";
import { useBuy } from "../hooks/useBuy";
import { Link , useLocation, useParams} from "react-router-dom";
import {Toast} from "../components/Modals/Toast";

interface RouteState {
  state: {
    assetAddress: string;
  };
}

interface toastProperties {
  data: 
  {
    title : string,
    description : string,
    backgroundColor:string
  }| undefined;
  close: () => void;

}

function InvestingDetail({currentAccount}:any) {
  const {address} = useParams();
  const {state} = useLocation() as RouteState;

  const [amount,setAmount] = useState("0");
  const {buy, txStatus} = useBuy(amount, currentAccount, address, state.assetAddress);
  const handleChange= (e:any) => {
    setAmount(e.target.value);
  }

  const [toastList, setToastList] = useState<toastProperties['data']|undefined>();
  let toastProperty:toastProperties['data'];
  const showToast = (type:string) => {
    switch(type) {
      case 'default':
        toastProperty = undefined;
        break;
      case 'pending':
        toastProperty = {
          title: 'Pending',
          description: 'Please Wait',
          backgroundColor: '#5bc0de'
        }
        break;
      case 'error':
        toastProperty={
          title: 'Failed',
          description: 'Fail to buy',
          backgroundColor: '#f0ad4e'
        }
        break;
      case 'success':
        toastProperty={
          title: 'Success',
          description: 'This is a success toast component',
          backgroundColor: '#5cb85c'
        }
        break;
      default:
        toastProperty = undefined;
    }
    setToastList(toastProperty);
  }

  console.log("TRACKING STATUS", txStatus);

  const closeToast: toastProperties['close'] =()=>{
    setToastList(undefined);
  }

  useEffect(()=> {
    showToast(txStatus);
  },[txStatus])

  return (
  <div>
  <div className="myinvest_banner">
    <input type="text" name="buyAmount" placeholder="Enter amount to buy" value={amount.toString()} onChange={handleChange}></input>
    <button type="button" onClick={() => buy(amount, currentAccount, address, state.assetAddress)}>buy</button>
  </div>
  <Toast data={toastList} close={closeToast}/>
  </div>
  )
}

export default InvestingDetail;
