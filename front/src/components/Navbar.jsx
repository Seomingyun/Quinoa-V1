import "./Navbar.css"
import { ReactComponent as Quinoalogo } from "../components/asset/quinoa_logo.svg";
import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
export const Navbar = ({currentAccount, correctNetwork, connectWallet, changeNetwork}) => {
  const [currentTab, setCurrentTab] = useState("investing");
  const formatAddress= (address) => {
    if (address.slice(-4) === ".eth") return address 
    return address.slice(0,4) + "..." + address.slice(-4);
  }
  const handleClick= (tab) => {
    setCurrentTab(tab);
  }
    return(
        <header id="heaeder_wrap">
        <div className="navbar">
          <div className="nav_logo">
            <Quinoalogo />
          </div>
          <div className="nav_menu_wrap">
            <div className="nav_menu cursor_pointer">
              <Link style={{ textDecoration: 'none' }} onClick={() => setCurrentTab("portfolio")} to="/portfolio" className={currentTab==="portfolio" ? "nav_txt_focused" : "nav_txt_default"}>Portfolio</Link>
              <Link style={{ textDecoration: 'none' }} onClick={() => setCurrentTab("investing")} to="/investing" className={currentTab==="investing" ? "nav_txt_focused" : "nav_txt_default"}>Investing</Link>
              <Link style={{ textDecoration: 'none' }} onClick={() => setCurrentTab("draft")} to="draft" className={currentTab==="draft" ? "nav_txt_focused" : "nav_txt_default"}>Draft</Link>
            </div>
          </div>
          {currentAccount === undefined ? (
            <div onClick = {connectWallet} type="button" className="wallet-status stateDefault-connectFalse cursor_pointer">
              <p className="start">Get started</p>
            </div>
            ) : !correctNetwork ? (
                <button onClick = {changeNetwork} type="button" className="wallet-status stateDefault-connectFalse cursor_pointer">
                  <p className="start">Change Network</p>
                </button>
            ) : (
                <button disabled  className="wallet-status stateDefault-connectFalse cursor_pointer">
                  <p className="start">{formatAddress(currentAccount)}</p>
                </button>
            )}
        </div>
      </header>
    )
}