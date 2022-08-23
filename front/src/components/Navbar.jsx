import "./Navbar.css"
import { ReactComponent as Quinoalogo } from "../components/asset/quinoa_logo.svg";

export const Navbar = ({currentAccount, correctNetwork, connectWallet, changeNetwork}) => {
    return(
        <header id="heaeder_wrap">
        <div className="navbar">
          <div className="nav_logo">
            <Quinoalogo />
          </div>
          <div className="nav_menu_wrap">
            <div className="nav_menu cursor_pointer">
              <a className="nav_txt_default">Portfolio</a>
              <a className="nav_txt_focused">Investing</a>
              <a className="nav_txt_default">Draft</a>
            </div>
          </div>
          {currentAccount === ''? (
            <button onClick = {connectWallet} type="button" className="wallet-status stateDefault-connectFalse cursor_pointer">
              <p className="start">Get started</p>
            </button>
            ) : !correctNetwork ? (
                <button onClick = {changeNetwork} type="button" className="wallet-status stateDefault-connectFalse cursor_pointer">
                  <p className="start">Change Network</p>
                </button>
            ) : (
                <button disabled  className="wallet-status stateDefault-connectFalse cursor_pointer">
                  <p className="start">{currentAccount}</p>
                </button>
            )}
        </div>
      </header>
    )
}