import React, {useState, useEffect} from "react";
import logo from "./logo.svg";
import "./App.css";
import "./index.css";
import {ethers} from 'ethers';

import InvestingList from "./pages/InvestingList";
import { Navbar } from "./components/Navbar";

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);

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
      setCurrentAccount(accounts[0]);
    }else {
        console.log('No authorized account found');
    }
  };

  const connectWallet = async () => {
    console.log("clicked");
    try {
      const {ethereum} = window;

      if(!ethereum) {
        console.log('Metamask not detected');
        return;
      }
      let chainId = await ethereum.request({method:'eth_chainId'})
      
      const address = await ethereum.enable();
      await console.log('address : ', address);
      
      const hardhatChainId = '0x539'
      if (chainId !== hardhatChainId) {
        alert('You are not connected to the Hardhat Testnet!');
        return;
      }
    
      console.log('Found account', address[0]);
      setCurrentAccount(address[0]);
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

    const hardhatChainId = '0x539'

    if (chainId !== hardhatChainId) {
      setCorrectNetwork(false)
    }else {
      setCorrectNetwork(true)
    }
  }
  useEffect(() => {
    checkIfWalletIsConnected();
    checkCorrectNetwork();
  }, [currentAccount]);

  return (
    <div>
      <Navbar 
        currentAccount={currentAccount}
        correctNetwork={correctNetwork}
        connectWallet={connectWallet}
        changeNetwork={changeNetwork}
      />
      <InvestingList />
    </div>
  )
}

export default App;