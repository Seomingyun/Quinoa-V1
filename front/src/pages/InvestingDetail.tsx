import React, { useEffect, useState } from "react";
import "./InvestingDetail.css";
import { useBuy } from "../hooks/useBuy";
import { Link, useLocation, useParams } from "react-router-dom";
import { Toast } from "../components/Modals/Toast";
import { VaultInfo } from "../models/VaultInfo";
import { ReactComponent as WishList } from "../components/asset/wishlist_default.svg";
import { ReactComponent as Infoicon } from "../components/asset/info_icon.svg";
import {ethers} from "ethers";
import { IERC20__factory, NftWrappingManager__factory } from "contract";
import { useDepositInfo } from "../hooks/useDepositInfo";
import data from "../utils/TokenAddressMapper.json";
import { useAvailableInfo } from "../hooks/useAvailableInfo";
import { useSell } from "../hooks/useSell";


interface RouteState {
  state: {
    assetAddress: string;
    vaultInfo : VaultInfo;
    svg : string;
  };
}

interface toastProperties {
  data:
    {
        title: string;
        description: string;
        backgroundColor: string;
      }
    | undefined;
  close: () => void;
}

function InvestingDetail({ currentAccount, setCurrentPage }: any) {
  setCurrentPage("");
  const { address } = useParams();
  const { state } = useLocation() as RouteState;
  const available = useAvailableInfo(currentAccount, state.vaultInfo); 

  const [amount, setAmount] = useState("0");
  const [sellAmount, setSellAmount] = useState("0");
  const [showMore, setShowMore] = useState(false);
  const [buySell, setBuySell] = useState<string>("buy");

  const { buy, txStatus } = useBuy(
    amount,
    currentAccount,
    address,
    state.assetAddress
  );

  const {sell, sellTxStatus} = useSell(state.vaultInfo);
  const handleChange = (e: any) => {
    setAmount(e.target.value);
  };

  const handleSellChange=(e:any) => {
    setSellAmount(e.target.value);
  }

  const [toastList, setToastList] = useState<
    toastProperties["data"] | undefined
  >();
  let toastProperty: toastProperties["data"];
  const showToast = (type: string) => {
    switch (type) {
      case "default":
        toastProperty = undefined;
        break;
      case "pending":
        toastProperty = {
          title: "Pending",
          description: "Please Wait",
          backgroundColor: "#5bc0de",
        };
        break;
      case "error":
        toastProperty = {
          title: "Failed",
          description: "Fail to buy",
          backgroundColor: "#f0ad4e",
        };
        break;
      case "success":
        toastProperty = {
          title: "Success",
          description: "This is a success toast component",
          backgroundColor: "#5cb85c",
        };
        break;
      default:
        toastProperty = undefined;
    }
    setToastList(toastProperty);
  };

  console.log("TRACKING STATUS", txStatus);

  const closeToast: toastProperties["close"] = () => {
    setToastList(undefined);
  };

  const formatDate = (date:string) => {
    const split = date.split(".");
  }

  const getTokenIcon = (address:string) => {
    return data.find(x => x.address === address)?.logo;
  }

  useEffect(() => {
    showToast(txStatus);
    showToast(sellTxStatus);
  }, [txStatus, sellTxStatus]);

  return (
    <div>
      <div className="investingDetail_Wrap">
        <div className="investingDetail_info">
          <div className="investNft_wrap">
          <object 
            type = "image/svg+xml" 
            className = "nft_img" 
            data = {state.svg} />
          </div>
          <div className="iD_about">
            <div className="subTitle">
              <span className="subTitle_txt QUINOAheadline6">About</span>
              <div className="st_underline"></div>
            </div>
            <div className={showMore ? "about_txtwrap_active" : "about_txtwrap"}>
              {/* CSS NEED TO BE FIXED */}
              <span className={showMore ? "atBtn_focused" : "atBtn_default"} 
              onClick = {() => setShowMore(!showMore)}
              ></span>
              
              <span className="about_txt">
                This fund provides exposure to blue-chip companies, being those
                which are large, stable and profitable. This includes household
                names such as Apple, Nike, Amazon, Nestle and Microsoft. With
                global diversification across all sectors, this fund provides
                reliable long-term capital growth. All blue-chip companies in
                this fund have global exposure, meaning they generate a
                significant amount of their revenues and hold a large amount of
                their assets abroad. The global presence, combined with their
                large nature and competitive positioning, means these companies
                will be more resilient to the business cycle and domestic
                shocks. This fund tracks the S&P Global 100 Ex-Controversial
                Weapons Index with key criteria for selection being market
                capitalisation. The index includes transnational companies that
                have a minimum float-adjusted market cap of USD 5 billion.
              </span>
            </div>
          </div>
          <div className="id_history">
            <div className="subTitle">
              <span className="subTitle_txt QUINOAheadline6">History</span>
              <div className="st_underline"></div>
            </div>
            <img src="/img/chart_img.png" className="history_chart"></img>
            <div className="underlyingTokens_wrap">
              <header className="ut_header">
                <span className="underlying_Tokens">Underlying Tokens</span>
                <span className="amount">Amount</span>
                <span className="volume">Volume</span>
              </header>
              <div className="header_underline"></div>
              <div className="list_tokens">
                <div className="lt_token">
                  <img src={getTokenIcon(state.vaultInfo.asset)} className="lt_token_icon"></img>
                  <span className="lt_token_txt QUINOABody-2">{state.vaultInfo.symbol}</span>
                </div>
                <div className="lt_Amount">
                  <span className="lt_Amount_txt QUINOABody-1">
                    {Number(ethers.utils.formatEther(state.vaultInfo.totalAssets)).toFixed(2)}</span>
                </div>
                <div className="lt_Volume">
                  <span className="lt_Volume_txt QUINOABody-1">${state.vaultInfo.totalVolume}</span>
                </div>
                <div className="ratioLine_wrap">
                  <div
                    style={{ left: "min(calc(515px * 0.90), 100%)" }}
                    className="ratioLine_txt"
                  >
                    <span className="ratioLine_txtIn">100%</span>
                  </div>
                  <div
                    style={{ width: "calc(515px * 1 + 5px)" }}
                    className="ratioLine"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="id_stat">
            <div className="subTitle">
              <span className="subTitle_txt QUINOAheadline6">Stats</span>
              <div className="st_underline"></div>
              <div className="etherscan_wrap">
                <img src="/img/etherscan_icon.png"></img>
                <Infoicon className="info_Icon"></Infoicon>
              </div>
            </div>
            {/* ------- row_01 ------ */}
            <div className="statRow_01">
              <div className="createBy">
                <span className="mainTxt">{state.vaultInfo.dacName}</span>
                <span className="subTxt">Create by</span>
              </div>
              <div className="totalVolume">
                <span className="mainTxt">${state.vaultInfo.totalVolume}</span>
                <span className="subTxt">Total Volume</span>
              </div>
              <div className="volume24h">
                <span className="mainTxt">$2,139.12</span>
                <span className="subTxt">24h Volume</span>
              </div>
            </div>
            {/* ------- row_02 ------ */}
            <div className="statRow_01">
              <div className="createBy">
                <span className="mainTxt">2.00%</span>
                <span className="subTxt">Streaming Fee</span>
              </div>
              <div className="totalVolume">
                <span className="mainTxt">318</span>
                <span className="subTxt">Holders</span>
              </div>
              <div className="volume24h">
                <span className="mainTxt">$1,301.92</span>
                <span className="subTxt">DAC's Deposit</span>
              </div>
            </div>
            {/* ------- row_03 ------ */}
            <div className="statRow_01">
              <div className="createBy">
                <span className="mainTxt">{state.vaultInfo.date}</span>
                <span className="subTxt">Inception Date</span>
              </div>
              <div className="totalVolume">
                <span className="mainTxt">Agressive</span>
                <span className="subTxt">Propensity</span>
              </div>
            </div>
          </div>
        </div>
        <div className="investingDetail_buyNsell">
          <div className="strategy_title_txt">
            <span className="strategy_Name_txt QUINOAheadline4">
              {state.vaultInfo.name}
            </span>
            <div className="strategy_By_txt">
              <div className="id_byIcon">
                <img
                  src="/img/strategyDao_icon_01.png"
                  className="id_byIcon_img"
                />
              </div>
              <span className="sB_txtIn">By {state.vaultInfo.dacName}</span>
            </div>
            <div className="wishlist">
              <div className="focused"></div>
            </div>
          </div>
          <div className="buyNsell">
            <div className="tab">
              <div className={buySell==="buy" ?"buy_tab" : "sell_tab"}
                onClick={() => setBuySell(("buy"))}>
                <span className={buySell==="buy" ?"buy_txt" : "sell_txt"}>Buy</span>
                <div className="line"></div>
              </div>
              <div className={buySell==="sell" ? "buy_tab" : "sell_tab"}
                onClick={() => setBuySell(("sell"))}>
                <span className={buySell==="sell" ?"buy_txt" : "sell_txt"}>Sell</span>
                <div className="line"></div>
              </div>
            </div>
            <div className="buysection_wrap" style={buySell=== "buy" ? {display:"flex"} : {display : "none"}}>
              <div className="amountInvested">
                <span className="ai_txt">amount invested</span>
                <span className="ai_amount">{available?.availableSaleAmount} {state.vaultInfo.symbol}</span>
              </div>
              <div className="investableAmount">
                <span className="ia_txt">Investable amount</span>
                <span className="ia_amount">{available?.availableBuyAmount} {state.vaultInfo.symbol}</span>
              </div>
              <input className="inputAmount" placeholder="$0,000.0" value={amount.toString()} onChange={handleChange}></input>
              <div className="amount_select_btn">
                <span className="amount_10%">10%</span>
                <div className="spaceLine"></div>
                <span className="amount_25%">25%</span>
                <div className="spaceLine"></div>
                <span className="amount_50%">50%</span>
                <div className="spaceLine"></div>
                <span className="amount_max">MAX</span>
              </div>
              <div className="convertedValue">
                <span className="cv_txt">converted value</span>
                <span className="cv_amount">34.32</span>
                <span className="eTH">ETH</span>
              </div>
              <div className="buyBtn" onClick={() => buy(amount, currentAccount, address, state.assetAddress)} >
                <span className="buy_txt">Buy</span>
              </div>
            </div>
            <div className="sellsection_wrap" style={buySell=== "sell" ? {display:"flex"} : {display : "none"}}>
              <div className="investablesaleAmount">
                <span className="isa_txt">available sale amount</span>
                <span className="isa_amount">{available?.availableSaleAmount} {state.vaultInfo.symbol}</span>
              </div>
              <input className="inputAmount" placeholder="$0,000.0" value={sellAmount.toString()} onChange={handleSellChange}></input>
              <div className="amount_select_btn">
                <span className="amount_10%">10%</span>
                <div className="spaceLine"></div>
                <span className="amount_25%">25%</span>
                <div className="spaceLine"></div>
                <span className="amount_50%">50%</span>
                <div className="spaceLine"></div>
                <span className="amount_max">MAX</span>
              </div>
              <div className="convertedValue">
                <span className="cv_txt">converted value</span>
                <span className="cv_amount">34.32</span>
                <span className="eTH">ETH</span>
              </div>
              <div className="sellBtn" onClick={() => sell(sellAmount)}>
                <span className="sell_txt">Sell</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast data={toastList} close={closeToast} />
    </div>
  );
}

export default InvestingDetail;
