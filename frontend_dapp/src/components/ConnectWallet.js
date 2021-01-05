import React, {useContext, useState, useEffect} from 'react'
import { useWallet, UseWalletProvider } from 'use-wallet'
import {AccountsContext, ConnectedContext} from './App'

function Connection() {
  const wallet = useWallet()
  const {accounts, setAccounts} = useContext(AccountsContext)
  const {isConnected, setIsConnected} = useContext(ConnectedContext)

  const connectWallet = async (e) => {
    if(!isMetaMaskInstalled()) {
      alert('MetaMask not found, please visit https://metamask.io/')
    }
    else {
      await wallet.connect()
      console.log(wallet.status)
      setIsConnected('connected')
    }

      
  } 

  const isMetaMaskInstalled = () => {
    const {ethereum} = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  }

  useEffect(() => {
    // window.ethereum.on('accountsChanged', accounts => {
    //   setAccounts(accounts);
    // })
    

    if (wallet.status === 'connected') {
      setIsConnected('connected')
      console.log(isConnected)
    }
    else if (wallet.status === 'disconnected') {
      setIsConnected('disconnected')
      console.log(isConnected)
    }
  },[wallet.status])

  return (
    <>
        <div>
          <button onClick={connectWallet} className="btn-send">Connect Wallet</button>
        </div>
    </>
  )
}

// Wrap everything in <UseWalletProvider />
export default () => (
  <UseWalletProvider
    chainId={1}
    connectors={{
      provided: { provider: window.cleanEthereum },
    }}
  >
    <Connection />
  </UseWalletProvider>
)