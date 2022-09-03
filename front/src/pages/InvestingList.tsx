import React, { useEffect, useState } from "react";
import "./InvestingList.css";
import { ethers } from "ethers";
import { ReactComponent as Quinoalogo } from "../components/asset/quinoa_logo.svg";
import { ReactComponent as Mibtnarrow } from "../components/asset/mibtn_arrow.svg";
import { ReactComponent as Infoicon } from "../components/asset/info_icon.svg";
import { ReactComponent as WishList } from "../components/asset/wishlist_default.svg";
import { Link } from "react-router-dom";
import SwiperCore, { Navigation, Pagination, Scrollbar } from "swiper";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import Investment from "../components/Investment";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

//Import hooks
import { useVaultList } from "../hooks/useVaultList";
import { assert } from "console";
import { useHoldingInfo } from "../hooks/useHoldingInfo";

SwiperCore.use([Navigation, Pagination, Scrollbar]);
// {key :val, key:val}
function InvestingList({ currentAccount, setCurrentPage }:any) {
  setCurrentPage("investing");
  const vaultList = useVaultList(currentAccount);
  const holdingInfo = useHoldingInfo(currentAccount);
  const [like, setLike] = useState<Map<number, boolean>>(new Map());
  //const [like, setLike] = useState([false])
  const handleLike = (index: number) => {
    if (like.has(index)) {
      console.log("has");

      let newLike = new Map(like);
      newLike.set(index, !like.get(index));
      setLike(newLike);
      console.log("after if", like);
    } else {
      console.log("new");
      let newLike = new Map(like);
      newLike.set(index, true);
      setLike(newLike);
      console.log("after els", like);
    }
  };

  return (
    <div>
      <section className="myinvest_banner">
        <div className="my-investments">
          <div className="mi_title">
            <a href="" className="mi-txt QUINOATitle-1">
              My investments
              <div className="btn_arrow">
                <Mibtnarrow />
              </div>
            </a>
          </div>
          <div className="banner_portfolio">
            <div className="banner_holdings">
              <span className="holdings QUINOAheadline6">Holdings</span>
              <span className="holdings_price QUINOAheadline3">
                ${(holdingInfo?.totalHoldings || 0).toFixed(2)}
              </span>
            </div>
            <div className="inner_Rectangle"></div>
            <div className="banner_earnings">
              <span className="earnings QUINOAheadline6">Earnings</span>
              <span className="earnings_price QUINOAheadline3">$42.23</span>
            </div>
          </div>
        </div>
        <div className="bannerLine_01"></div>
        <div className="bannerLine_02"></div>
      </section>
      <section className="exploreInvesting">
        <div className="ei_wrap">
          <div className="ei_title">
            <span className="explore">Explore</span>
            <span className="investing">&nbsp;Investing</span>
            <span className="investing_blur">&nbsp;Investing</span>
          </div>
          <span className="subtitle">
            San Franciscan contrarian Conference attendee Out of touch, ad
            buying venture investor. Protocol writing, inflated B2B SaaS series
            B. Direct delivery food buyer frictionless plugin.
          </span>
        </div>
      </section>
      <section className="highestAPY_wrap">
        <div className="highestAPY">
          <div className="ha_title">
            <span className="ha_title_main QUINOAheadline5">Highest APY</span>
            <span className="ha_title_sub QUINOABody-3">
              San Franciscan contrarian Conference attendee Out of touch.
            </span>
          </div>
          <Swiper
            slidesPerView={4}
            spaceBetween={27}
            slidesPerGroup={4}
            speed={400}
            loop={false}
            loopFillGroupWithBlank={true}
            pagination={{ 
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {vaultList?.map((item, idx) => (
              //<Slide item = {item}/>
              <SwiperSlide className="hi_swiperslide">
                <div className="stateDefault">
                  <Link
                    to={"./detail/" + item.address}
                    state={!!item.nftSvg ? { assetAddress: item.asset, vaultInfo: item, svg: item.nftSvg, tokenId: item.tokenId}
                    : { assetAddress: item.asset, vaultInfo: item, svg: item.vaultSvg }}
                    className="strategy_ctaBtn"
                    style={{ textDecoration: "none" }}
                  >
                    Buy
                  </Link>
                  <div className="hi_headline">
                    <div className="list_Strategy_name">
                      <span className="ls_name_title QUINOABody-2">
                        {item.name}
                      </span>
                      <div className="ls_STtoken">
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
                    <div className="wishlist">
                      <div
                        className={
                          like.get(idx) ? "default focused" : "default"
                        }
                        onClick={() => handleLike(idx)}
                      ></div>
                    </div>
                  </div>
                  <div className="hi_nftImg_wrap">
                    <div className="hi_nftImg">
                    <object 
                      type = "image/svg+xml" 
                      className = "hi_nftimg" 
                      data = {!!item.vaultSvg ? item.vaultSvg : item.nftSvg}
                    />
                    </div>
                  </div>
                  <div className="hi_description">
                    <span className="desc_txt QUINOABody-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      seddo dskfna;
                    </span>
                  </div>
                  <div className="hi_info">
                    <div className="apy_wrap">
                      <span className="apy_title QUINOASubtitle-2">APY</span>
                      <div className="apy_per">
                        <div className="up_arrow"></div>
                        <span className="up_Num QUINOAheadline6">8.9%</span>
                      </div>
                    </div>
                    <div className="middleLine"></div>
                    <div className="volume_wrap">
                      <span className="volume_title QUINOASubtitle-2">
                        Volume
                      </span>
                      <span className="volume_amount QUINOAheadline6">
                        ${item.totalVolume}
                      </span>
                    </div>
                  </div>
                  <div className="hi_byStrategy">
                    <div className="byIcon">
                      <img
                        src="/img/byIcon_img_01.png"
                        className="byIcon_img"
                      />
                    </div>
                    <span className="By_Strategy_name">
                      By {item.dacName}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <section className="investList_wrap">
        <div className="investList">
          <div className="iL_title">
            <span className="iL_title_main QUINOAheadline5">Investment</span>
            <span className="iL_title_sub QUINOABody-3">
              San Franciscan contrarian Conference attendee Out of touch.
            </span>
          </div>
          <div className="fiat_toggle">
            <Infoicon className="info_Icon"></Infoicon>
            <span className="fiat_txt">fiat</span>
            <div className="toggle_outline">
              <div className="innerCircle"></div>
            </div>
          </div>
          <div className="iL_list"></div>
          <div className="il_table">
            <header className="il_table_header">
              <div className="list_Rowheader">
                <p className="header_Wish">Wish</p>
                <p className="header_Strategy">Strategy</p>
                <p className="header_Propensity">Propensity</p>
                <p className="header_Apy">APY</p>
                <p className="header_Volume">Volume(24h)</p>
                <p className="header_totalVolume">Total Volume</p>
              </div>
            </header>
            <div className="header_line"></div>
            {/* 1st */}
            {vaultList?.map((item, idx) => (
              <Investment item={item} />
            ))}
          </div>
          <span className="text-button">
            Create a strategy with the experts <span>&#8594;</span>
          </span>
          <div className="lt_moreBtn">
            <span className="moreBtn_txt">
              Load more<div className="moreBtn_arrow"></div>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default InvestingList;
