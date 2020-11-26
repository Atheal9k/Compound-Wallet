import React, { useState, useEffect } from "react";
import getWeb3 from "../getWeb3";
import Wallets from "../contracts/Wallets.json";
import daiAbi from "../abis/dai_abi.js";
import compoundCDaiContractAbi from "../abis/compoundCDai_abi.js";
import Compound from './compound';
import Route from './Route';
import DepositDai from './DepositDai';
import DaiBalancePage from './DaiBalancePage';




const App = () => {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [balance, setBalance] = useState(0)
  const [number, setNumber] = useState(0)
  const [input, setInput] = useState(0)
  const [daiContract, setDaiContract] = useState(undefined);
  const [compoundCDaiContract, setCompoundCDaiContract] = useState(undefined);
  const [fromMyWallet, setFromMyWallet] = useState(undefined)

  const assetName = 'DAI';
  const contractAddress = "0x626acb7D3feB20c0a57e9ef88aEE1c9C3aF03578"
  const daiMainNetAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
  const compoundCDaiContractAddress = '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643';

  const privateKey = '0xfe5a297accc177b5585f0c1214d8baac430f27c6c4ea7630f7a703d27ffa7b73';

  
 

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Wallets.networks[networkId];
        // const contract = new web3.eth.Contract(
        //   Wallets.abi,
        //   deployedNetwork && deployedNetwork.address
        // );
        const contract = new web3.eth.Contract(Wallets.abi, contractAddress, {from: accounts[0]})
        const daiContract = new web3.eth.Contract(daiAbi, daiMainNetAddress);
        const compoundCDaiContract = new web3.eth.Contract(compoundCDaiContractAbi, compoundCDaiContractAddress);

        web3.eth.accounts.wallet.add(privateKey);
        const myWalletAddress = web3.eth.accounts.wallet[0].address;

        const fromMyWallet = {
          from: myWalletAddress,
          gasLimit: web3.utils.toHex(500000),
          gasPrice: web3.utils.toHex(20000000000) // use ethgasstation.info (mainnet only)
        };
        
        

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
        setDaiContract(daiContract);
        setCompoundCDaiContract(compoundCDaiContract);
        setFromMyWallet(fromMyWallet)
      } catch (error) {
        // Catch any errors for any of the above operations.
        console.log(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const load = async () => {
      // Stores a given value, 5 by default.
     // await contract.methods.save(10).send({ from: accounts[0] });

      
      //const balances = await contract.methods.balance().call();
     //   setBalance(balances)
    //  await contract.methods.setTest(7).send({ from: accounts[0] });
    //  var kek = await contract.methods.getTest().call();
    //  setNumber(kek);
     

    };
    if (
      typeof web3 !== "undefined" &&
      typeof accounts !== "undefined" &&
      typeof contract !== "undefined"
    ) {
      load();
    }
    else {
        console.log(contract)
    }
  }, [web3, accounts, contract]);


 

  const sendDaiToWallet = async (amount) => {
    console.log(`Now transferring ${assetName} from my wallet to MyContract...`);

    let transferResult = await daiContract.methods.transfer(contractAddress, web3.utils.toHex(amount * Math.pow(10, 18))).send(fromMyWallet)

    console.log(`MyContract now has ${assetName} to supply to the Compound Protocol.`);
  }

  const supplyToCompound = async () => {
    console.log(`MyContract is now minting c${assetName}...`);
    let aaa = await daiContract.methods.approve(compoundCDaiContractAddress, web3.utils.toHex(10 * Math.pow(10, 18)));
    let supplyResult = await contract.methods.supplyDAIToCompound(daiMainNetAddress, compoundCDaiContractAddress, web3.utils.toHex(10 * Math.pow(10, 18))).send(fromMyWallet)
    console.log(`Supplied ${assetName} to Compound via MyContract`);
    console.log(supplyResult)
    console.log(supplyResult.events.MyLog)
  }

  const balanceInCompound = async() => {
    let balanceOfDaiInCompound = await compoundCDaiContract.methods.balanceOfUnderlying(contractAddress).call();
    const daiForReading = web3.utils.fromWei(balanceOfDaiInCompound)
    console.log(`${assetName} supplied to the Compound Protocol:`, daiForReading);

    var cDaiBalance = await compoundCDaiContract.methods.balanceOf(contractAddress).call();
    cDaiBalance = cDaiBalance /1e8;
    console.log(`MyContract's c${assetName} Token Balance:`, cDaiBalance)
    return cDaiBalance;
  }

  const checkDaiBalance = async () => {
    

    let transferResult = await daiContract.methods.balanceOf(contractAddress).call()
    const daiForReading = web3.utils.fromWei(transferResult)
    console.log(daiForReading);
    
  }

  const sendToYFI = async () => {
    let supplyResult = await contract.methods.save(web3.utils.toHex(10 * Math.pow(10, 18))).send(fromMyWallet)
    

  }

  const redeemCDAITokens = async () => {
    
    // get balance back
    var cDaiBalance = await compoundCDaiContract.methods.balanceOf(contractAddress).call();
    cDaiBalance = cDaiBalance /1e8;

    const amount = web3.utils.toHex(cDaiBalance * 1e8);
    const redeemType = true;
    console.log(`Redeeming the c${assetName} for ${assetName}...`);

    let redeemResult = await contract.methods.redeemCDai(amount, redeemType, compoundCDaiContractAddress).send(fromMyWallet);

    // if (redeemResult.events.MyLog.returnValues[1] != 0) {
    //   throw Error('Redeem Error Code: '+redeemResult.events.MyLog.returnValues[1]);
    // }

    cDaiBalance = await compoundCDaiContract.methods.balanceOf(contractAddress).call();
    cDaiBalance = cDaiBalance / 1e8;
    console.log(`MyContract's c${assetName} Token Balance:`, cDaiBalance);
  }

  if (typeof web3 === "undefined") {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

 

  return (
    <div className="rootSectionMenu">
      <Compound web3={web3} contract={contract} daiContract={daiContract} compoundCDaiContract={compoundCDaiContract} fromMyWallet={fromMyWallet}> </Compound>
      <Route path="/deposit"><DepositDai deposit={sendDaiToWallet}/></Route>
      
      
      
    </div>
    
  );
};

export default App;