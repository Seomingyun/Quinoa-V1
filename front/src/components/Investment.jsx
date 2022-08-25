import React, {useState} from "react"
const Investment = ({item}) => {
    const [like, setLike] = useState(false); 
    return(
        <div className="list_strategy">
              <div className="ls_wishlist_wrap">
                <div className="wishlist">
                  <div className={like ? "default focused" : "default"} onClick={() => {setLike((prev)=>!prev)}}></div>
                </div>
              </div>
              <div className="ls_strategyname_wrap">
                <div className="list_Strategy_name">
                  <span className="ls_name_title QUINOABody-2">
                    {item.name}
                  </span>
                  <div className="ls_STtoken">
                    <img src="img/STtoken_img_01.svg" className="sTtoken_img" />
                    <img src="img/STtoken_img_02.svg" className="sTtoken_img" />
                    <img src="img/STtoken_img_03.svg" className="sTtoken_img" />
                  </div>
                </div>
              </div>
              <div className="assistivceChip_wrap">
                <div className="chipbox_low"></div>
              </div>
              <div className="apy_number_wrap">
                <div className="apy_number">
                  <div className="apy_down"></div>
                  <span className="apy_number_txt_down">
                    8.9<span className="percent_bold">%</span>
                  </span>
                </div>
              </div>
              <div className="volume24h_wrap">
                <span className="volume24h QUINOABody-1">$246.7K</span>
              </div>
              <div className="totalVolume_wrap">
                <span className="totalVolume QUINOABody-1">{Number(item.totalAssets)}&nbsp;{item.symbol}</span>
              </div>
              <div className="ls_underline"></div>
              </div>
    )
}
export default Investment;