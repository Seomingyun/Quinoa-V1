import React, { useEffect, useState } from "react";
import "./InvestingDetail.css";
import { useBuy } from "../hooks/useBuy";
import { Link, useLocation, useParams } from "react-router-dom";
import { Toast } from "../components/Modals/Toast";
import imgA from "../components/img/byIcon_img_01.png";
import { ReactComponent as WishList } from "../components/asset/wishlist_default.svg";
import { ReactComponent as Infoicon } from "../components/asset/info_icon.svg";
interface RouteState {
  state: {
    assetAddress: string;
  };
}

interface toastProperties {
  data:
    | {
        title: string;
        description: string;
        backgroundColor: string;
      }
    | undefined;
  close: () => void;
}

function InvestingDetail({ currentAccount }: any) {
  const { address } = useParams();
  const { state } = useLocation() as RouteState;

  const [amount, setAmount] = useState("0");
  const { buy, txStatus } = useBuy(
    amount,
    currentAccount,
    address,
    state.assetAddress
  );
  const handleChange = (e: any) => {
    setAmount(e.target.value);
  };

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

  useEffect(() => {
    showToast(txStatus);
  }, [txStatus]);

  return (
    <div>
      <div className="investingDetail_Wrap">
        <div className="investingDetail_info">
          <div className="investNft_wrap">
            <div className="nft_img"></div> {/* nft svg 넣으면 됨 */}
          </div>
          <div className="iD_about">
            <div className="subTitle">
              <span className="subTitle_txt QUINOAheadline6">About</span>
              <div className="st_underline"></div>
            </div>
            <div className="about_txtwrap">
              <span className="atBtn_default"></span>
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
                  <img src="/img/eth_icon.png" className="lt_token_icon"></img>
                  <span className="lt_token_txt QUINOABody-2">ETH</span>
                </div>
                <div className="lt_Amount">
                  <span className="lt_Amount_txt QUINOABody-1">82.0183</span>
                </div>
                <div className="lt_Volume">
                  <span className="lt_Volume_txt QUINOABody-1">$2,346.7M</span>
                </div>
                <div className="ratioLine_wrap">
                  <div
                    style={{ left: "min(calc(515px * 0.84), 50%)" }}
                    className="ratioLine_txt"
                  >
                    <span className="ratioLine_txtIn">50%</span>
                  </div>
                  <div
                    style={{ width: "calc(515px * 0.5 + 5px)" }}
                    className="ratioLine"
                  ></div>
                </div>
              </div>
              <div className="list_tokens">
                <div className="lt_token">
                  <img src="/img/eth_icon.png" className="lt_token_icon"></img>
                  <span className="lt_token_txt QUINOABody-2">ETH</span>
                </div>
                <div className="lt_Amount">
                  <span className="lt_Amount_txt QUINOABody-1">82.0183</span>
                </div>
                <div className="lt_Volume">
                  <span className="lt_Volume_txt QUINOABody-1">$2,346.7M</span>
                </div>
                <div className="ratioLine_wrap">
                  <div
                    style={{ left: "min(calc(515px * 0.84), 50%)" }}
                    className="ratioLine_txt"
                  >
                    <span className="ratioLine_txtIn">50%</span>
                  </div>
                  <div
                    style={{ width: "calc(515px * 0.5 + 5px)" }}
                    className="ratioLine"
                  ></div>
                </div>
              </div>
              <div className="list_tokens">
                <div className="lt_token">
                  <img src="/img/eth_icon.png" className="lt_token_icon"></img>
                  <span className="lt_token_txt QUINOABody-2">ETH</span>
                </div>
                <div className="lt_Amount">
                  <span className="lt_Amount_txt QUINOABody-1">82.0183</span>
                </div>
                <div className="lt_Volume">
                  <span className="lt_Volume_txt QUINOABody-1">$2,346.7M</span>
                </div>
                <div className="ratioLine_wrap">
                  <div
                    style={{ left: "min(calc(515px * 0.84), 50%)" }}
                    className="ratioLine_txt"
                  >
                    <span className="ratioLine_txtIn">50%</span>
                  </div>
                  <div
                    style={{ width: "calc(515px * 0.5 + 5px)" }}
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
                <span className="mainTxt">SuperDAO</span>
                <span className="subTxt">Create by</span>
              </div>
              <div className="totalVolume">
                <span className="mainTxt">$13,021.71</span>
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
                <span className="subTxt">Creator's Balance</span>
              </div>
            </div>
            {/* ------- row_03 ------ */}
            <div className="statRow_01">
              <div className="createBy">
                <span className="mainTxt">2022.01.14</span>
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
              Perfect Super Vault
            </span>
            <div className="strategy_By_txt">
              <div className="id_byIcon">
                <img
                  src="/img/strategyDao_icon_01.png"
                  className="id_byIcon_img"
                />
              </div>
              <span className="sB_txtIn">By SuperDAO</span>
            </div>
            <div className="wishlist">
              <div className="focused"></div>
            </div>
          </div>
          <div className="buyNsell">
            <div className="tab">
              <div className="buy_tab">
                <span className="buy_txt">Buy</span>
                <div className="line"></div>
              </div>
              <div className="sell_tab">
                <span className="sell_txt">Sell</span>
                <div className="line"></div>
              </div>
            </div>
            <div className="buysection_wrap">
              <div className="amountInvested">
                <span className="ai_txt">amount invested</span>
                <span className="ai_amount">$4,280.21</span>
              </div>
              <div className="investableAmount">
                <span className="ia_txt">Investable amount</span>
                <span className="ia_amount">$14,280,989.21</span>
              </div>
              <input className="inputAmount" placeholder="$0,000.0"></input>
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
              <div className="buyBtn">
                <span className="buy_txt">Buy</span>
              </div>
            </div>
            <div className="sellsection_wrap">
              <div className="investablesaleAmount">
                <span className="isa_txt">available sale amount</span>
                <span className="isa_amount">$14,280,989.21</span>
              </div>
              <input className="inputAmount" placeholder="$0,000.0"></input>
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
              <div className="sellBtn">
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
