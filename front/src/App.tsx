import React, {useState, useEffect} from "react";
import logo from "./logo.svg";
import "./App.css";
import "./index.css";
import {ethers} from 'ethers';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InvestingList from "./pages/InvestingList";
import { Navbar } from "./components/Navbar";
import InvestingDetail from "./pages/InvestingDetail";
import Portfolio from "./pages/Portfolio";
import { Footer } from "./components/Footer";

function App() {
  const [currentAccount, setCurrentAccount] = useState<String|undefined>();
  const [currentNetwork, setCurrentNetwork] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(true);
  const [currentPage, setCurrentPage] = useState("");

  const handleCurrentAccount = async (address:any) => {
    const provider = ethers.getDefaultProvider();
    const name = await provider.lookupAddress(address);
    if (name) setCurrentAccount(name);
    else setCurrentAccount(address);
  }

  const listenMMAccount= async()=> {
    const {ethereum} = window;
    ethereum.on("accountsChanged", async function() {
      const accounts = await ethereum.request({method: "eth_accounts"});
      const account = [...accounts].pop();
      handleCurrentAccount(account);
      console.log("found new account : ",  account);
    })
  }

  const listenMMNetwork = async() => {
    const {ethereum} = window;
    ethereum.on("networkChanged",function() {
      checkCorrectNetwork();
    })
  }

  const checkIfWalletIsConnected = async () => {
    const {ethereum} = window;
    if (ethereum) {
        console.log('Got the ethereum object: ', ethereum);
    }else {
        console.log('No Wallet found. Connect Wallet');
    }
    const accounts = await ethereum.request({method: "eth_accounts"});
    if (accounts.length !== 0) {
      console.log('Found authorized Account: ', accounts[0]);
      handleCurrentAccount(accounts[0]);
      checkCorrectNetwork();
    }else {
        console.log('No authorized account found');
    }
  };

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if(!ethereum) {
        console.log('Metamask not detected');
        return;
      }
      let chainId = await ethereum.request({method:'eth_chainId'})
      
      const address = await ethereum.enable();
      await console.log('address : ', address);
      
      const hardhat = '0x539'
      const mumbai = '0x13881'
      if (chainId !== mumbai) {
        console.log("network is not in mumbai. Change Network");
        changeNetwork();
      }
      console.log('Connected to Account: ', address[0]);
      handleCurrentAccount(address[0]);
    } catch(error) {
      console.log('Error connecting to metamask', error)
    }
  }

  const changeNetwork = async() => {
    const hardhat = '0x539'
    const mumbai = '0x13881'
    if (window.ethereum.networkVersion !== mumbai) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: mumbai }]
          });
        } catch (err:any) {
            // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: 'Mumbai',
                  chainId: mumbai,
                  rpcUrls: ['https://rpc-mumbai.maticvigil.com/']
                }]
            });
          }
        }
      }
  }

  const checkCorrectNetwork = async () => {
    const {ethereum} = window;
    let chainId = await ethereum.request({method : 'eth_chainId'})
    console.log('Conneted to chian' + chainId);

    const hardhat = '0x539'
    const mumbai = '0x13881'

    if (chainId !== mumbai) {
      setCorrectNetwork(false)
    }else {
      setCorrectNetwork(true)
    }
  }
  useEffect(() => {
    checkIfWalletIsConnected();
    listenMMAccount();
    listenMMNetwork();
  }, [currentAccount]);

  return (
    <div>
      <BrowserRouter>
      <Navbar 
          currentAccount={currentAccount}
          correctNetwork={correctNetwork}
          connectWallet={connectWallet}
          changeNetwork={changeNetwork}
          currentPage={currentPage}
          />
      <Routes>
        <Route path="/investing" element={<InvestingList 
          currentAccount={currentAccount}
          setCurrentPage={setCurrentPage}
          />}>
        </Route>
        <Route path='/investing/detail/:address' element={<InvestingDetail 
        currentAccount={currentAccount}
        setCurrentPage={setCurrentPage}
        />} />
        <Route path='/portfolio' element={<Portfolio
         currentAccount={currentAccount}
         setCurrentPage={setCurrentPage}
         />} />
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default App;