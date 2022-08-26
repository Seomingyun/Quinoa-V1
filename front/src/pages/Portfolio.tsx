import "./Portfolio.css"
import { ReactComponent as Infoicon } from "../components/asset/info_icon.svg";
import { ReactComponent as Walleticon } from "../components/asset/wallet_icon.svg";
import { ReactComponent as ETHicon} from "../components/asset/ETH_Token_icon.svg";
import { ReactComponent as AVAXicon } from "../components/asset/AVAX_Token_icon.svg";
import { ReactComponent as SendIcon } from "../components/asset/send_icon.svg";
import { ReactComponent as ReceiveIcon } from "../components/asset/receive-icon.svg";

function Portfolio () {
    return(
      <div>
        <section className="totalBalance_wrap">
          <div className="totalBalance">
            <div className="tb_title">
              <span className="tb_title_main QUINOAheadline5">
                Total Balance              
             </span>
             <Infoicon className="info_Icon"></Infoicon> 
            </div>

            <div className="tb_contents_wrap">
              <div className="tb_contents_main">
                <div className="tb_balance">
                  <Walleticon className="wallet_Icon"></Walleticon>
                  <div className="QUINOAheadline2">
                    <span className="text_color_900" >$24,239</span>
                    <span className="text_color_100">.21</span>  
                  </div>
                </div>
                <div className="tb_buttons">
                  <div className="tb_contents_bnt cursor_pointer">
                    <p>
                      <ReceiveIcon className="tb_contents_bnt_icon"></ReceiveIcon>
                      <span className="tb_contents_bnt_text">Receive</span>
                    </p>
                  </div>
                  <div className="tb_contents_bnt cursor_pointer">
                    <p>
                      <SendIcon className="tb_contents_bnt_icon"></SendIcon>
                      <span className="tb_contents_bnt_text">Send</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="tb_contents_sub">
                available : $1,201.75
              </div>
            </div>
          </div>

          <div className="walletList">
            <div className="wl_table">
            <header className="wl_table_header">
              <div className="list_Rowheader">
                <p className="header_Tokens">Tokens in wallet</p>
                <p className="header_Balance">Balance</p>
                <p className="header_Amount">Amount</p>
              </div>
            </header>
            <div className="header_line"></div>
            {/* 1st */}
            <div className="list_tokens">
              <div className="ls_tokenname_wrap">
                <div className="list_token_name">
                  <ETHicon className="ls_token_icon"></ETHicon>
                  <span className="ls_name_title QUINOABody-2">
                    ETH
                  </span>
                </div>
              </div>
              <div className="ls_tokenbalance_wrap">
                <div className="list_token_balance">
                  <span className="ls_token_balance QUINOABody-2">
                    $21,200.21
                  </span>
                </div>
              </div>
              <div className="ls_tokenamount_wrap">
                <div className="list_token_amount">
                  <span className="ls_token_amount QUINOABody-2">
                    15.2072
                  </span>
                </div>
              </div>
              <div className="ls_underline"></div>
            </div>
            {/* 2nd */}
            <div className="list_tokens">
              <div className="ls_tokenname_wrap">
                <div className="list_token_name">
                  <AVAXicon className="ls_token_icon"></AVAXicon>
                  <span className="ls_name_title QUINOABody-2">
                    Matic
                  </span>
                </div>
              </div>
              <div className="ls_tokenbalance_wrap">
                <div className="list_token_balance">
                  <span className="ls_token_balance QUINOABody-2">
                   $1,200
                  </span>
                </div>
              </div>
              <div className="ls_tokenamount_wrap">
                <div className="list_token_amount">
                  <span className="ls_token_amount QUINOABody-2">
                    4028.2
                  </span>
                </div>
              </div>
              <div className="ls_underline"></div>
            </div>
            {/* 3rd */}
            <div className="list_tokens">
              <div className="ls_tokenname_wrap">
                <div className="list_token_name">
                  <AVAXicon className="ls_token_icon"></AVAXicon>
                  <span className="ls_name_title QUINOABody-2">
                    Avalanche
                  </span>
                </div>
              </div>
              <div className="ls_tokenbalance_wrap">
                <div className="list_token_balance">
                  <span className="ls_token_balance QUINOABody-2">
                    $1,693
                  </span>
                </div>
              </div>
              <div className="ls_tokenamount_wrap">
                <div className="list_token_amount">
                  <span className="ls_token_amount QUINOABody-2">
                    3,215.2072
                  </span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        <section className="myInvestment_wrap">
          <div className="myInvestmentViewer">
            <div className="mIV_title">
              <div>
              <span className="mIV_title_main QUINOAheadline5">Investment</span>
              <Infoicon className="info_Icon"></Infoicon> 
              </div>
              <span className="mIV_title_sub QUINOABody-3">
                San Franciscan contrarian Conference attendee Out of touch.
              </span>
            </div>

            <div className="myInvestment_contents_wrap">
              <div className="myTotal_Contents">
                <div className="mTC_title QUINOASubTitle-1">Total Holdings</div>
                <div className="mTC_contents QUINOAheadline4">
                  <span className = "text_color_900">$234,102</span>
                  <span className="text_color_100">.01</span>
                </div>                
                <div className="text_color_green300">+ $201.15 (5.26%)</div>
              </div>
              <div className="myTotal_Contests_Splitter" />
              <div className="myTotal_Contents">
                <div className="mTC_title QUINOASubTitle-1">Total Earnings</div>
                <div className="mTC_contents QUINOAheadline4">
                  <span className = "text_color_900">$132,204</span>
                  <span className="text_color_100">.52</span>
                </div>
                <div>
                  <span className="text_color_200">Est. yearly </span>
                  <span className="text_color_green300">+ $12.201 (1.26%)</span>
                </div>
              </div>
              <div className="myTotal_Contests_Splitter" />
              <div className="myTotal_Contents">
                <div className="mTC_title QUINOASubTitle-1">QUI Tokens</div>
                <div className="mTC_contents QUINOAheadline4">
                  <span className="text_color_900">3,401</span>
                  <span className="text_color_100">.82</span>
                </div>
                <div className="text_color_200">USD 32.15</div>
              </div>
            </div>
          </div>

          <div className="myInvestmentList">
            <div className="mIL_title_wrap">
              <div className="mIL_title">Investment Lists</div>
              <div className="mIL_splitter_main"></div>
              <div className="mIL_splitter_sub"></div>
            </div>
            
            <div className="mIL_lists_wrap">
              {/* NFT Row #2 */}
              <div className="mIL_lists_row">
                {/* NFT #1 */}
                <div className="mIL_lists_NFT">
                  <div className="NFT_headline">
                    <div className="NFT_dac_name">
                      By SuperDAC
                    </div>
                    <div className="NFT_investments_desc">
                      <div className="NFT_investmetns_name">
                        Super Yield farming Fund
                      </div>
                      <div className="NFT_sTtoken_list">
                          <img
                            src="img/STtoken_img_01.svg"
                            className="sTtoken_img"
                          />
                          <img
                            src="img/STtoken_img_02.svg"
                            className="sTtoken_img"
                          />
                          <img
                            src="img/STtoken_img_03.svg"
                            className="sTtoken_img"
                          />
                        </div>
                    </div>
                  </div>

                    <div className="NFT_Img_wrap">
                      <div className="NFT_Img">
                        <img
                          src="img/strategy_img_01.png"
                          className="sTtoken_img"
                        />
                      </div>
                    </div>
                </div>
                {/* NFT #2 */}
                <div className="mIL_lists_NFT">
                  <div className="NFT_headline">
                    <div className="NFT_dac_name">
                      By SuperDAC
                    </div>
                    <div className="NFT_investments_desc">
                      <div className="NFT_investmetns_name">
                        Super Yield farming Fund
                      </div>
                      <div className="NFT_sTtoken_list">
                          <img
                            src="img/STtoken_img_01.svg"
                            className="sTtoken_img"
                          />
                          <img
                            src="img/STtoken_img_02.svg"
                            className="sTtoken_img"
                          />
                          <img
                            src="img/STtoken_img_03.svg"
                            className="sTtoken_img"
                          />
                        </div>
                    </div>
                  </div>

                    <div className="NFT_Img_wrap">
                      <div className="NFT_Img">
                        <img
                          src="img/strategy_img_01.png"
                          className="sTtoken_img"
                        />
                      </div>
                    </div>
                </div>
                {/* NFT #3 */}
                <div className="mIL_lists_NFT">
                  <div className="NFT_headline">
                    <div className="NFT_dac_name">
                      By SuperDAC
                    </div>
                    <div className="NFT_investments_desc">
                      <div className="NFT_investmetns_name">
                        Super Yield farming Fund
                      </div>
                      <div className="NFT_sTtoken_list">
                          <img
                            src="img/STtoken_img_01.svg"
                            className="sTtoken_img"
                          />
                          <img
                            src="img/STtoken_img_02.svg"
                            className="sTtoken_img"
                          />
                          <img
                            src="img/STtoken_img_03.svg"
                            className="sTtoken_img"
                          />
                        </div>
                    </div>
                  </div>

                    <div className="NFT_Img_wrap">
                      <div className="NFT_Img">
                        <img
                          src="img/strategy_img_01.png"
                          className="sTtoken_img"
                        />
                      </div>
                    </div>
                </div>
              </div>
              {/* NFT Row #2 */}
              <div className="mIL_lists_row">
                {/* NFT #1 */}
                <div className="mIL_lists_NFT">
                  <div className="NFT_headline">
                    <div className="NFT_dac_name">
                      By SuperDAC
                    </div>
                    <div className="NFT_investments_desc">
                      <div className="NFT_investmetns_name">
                        Super Yield farming Fund
                      </div>
                      <div className="NFT_sTtoken_list">
                          <img
                            src="img/STtoken_img_01.svg"
                            className="sTtoken_img"
                          />
                          <img
                            src="img/STtoken_img_02.svg"
                            className="sTtoken_img"
                          />
                          <img
                            src="img/STtoken_img_03.svg"
                            className="sTtoken_img"
                          />
                        </div>
                    </div>
                  </div>

                    <div className="NFT_Img_wrap">
                      <div className="NFT_Img">
                        <img
                          src="img/strategy_img_01.png"
                          className="sTtoken_img"
                        />
                      </div>
                    </div>
                </div>
                {/* NFT #2 */}
                <div className="mIL_lists_NFT">
                  <div className="NFT_headline">
                    <div className="NFT_dac_name">
                      By SuperDAC
                    </div>
                    <div className="NFT_investments_desc">
                      <div className="NFT_investmetns_name">
                        Super Yield farming Fund
                      </div>
                      <div className="NFT_sTtoken_list">
                          <img
                            src="img/STtoken_img_01.svg"
                            className="sTtoken_img"
                          />
                          <img
                            src="img/STtoken_img_02.svg"
                            className="sTtoken_img"
                          />
                          <img
                            src="img/STtoken_img_03.svg"
                            className="sTtoken_img"
                          />
                        </div>
                    </div>
                  </div>

                    <div className="NFT_Img_wrap">
                      <div className="NFT_Img">
                        <img
                          src="img/strategy_img_01.png"
                          className="sTtoken_img"
                        />
                      </div>
                    </div>
                </div>
                {/* NFT #3 */}
                <div className="mIL_lists_NFT">
                  <div className="NFT_headline">
                    <div className="NFT_dac_name">
                      By SuperDAC
                    </div>
                    <div className="NFT_investments_desc">
                      <div className="NFT_investmetns_name">
                        Super Yield farming Fund
                      </div>
                      <div className="NFT_sTtoken_list">
                          <img
                            src="img/STtoken_img_01.svg"
                            className="sTtoken_img"
                          />
                          <img
                            src="img/STtoken_img_02.svg"
                            className="sTtoken_img"
                          />
                          <img
                            src="img/STtoken_img_03.svg"
                            className="sTtoken_img"
                          />
                        </div>
                    </div>
                  </div>

                    <div className="NFT_Img_wrap">
                      <div className="NFT_Img">
                        <img
                          src="img/strategy_img_01.png"
                          className="sTtoken_img"
                        />
                      </div>
                    </div>
                </div>
              </div>

            </div>
          </div>
          

        </section>

      </div>
    )
}

export default Portfolio;