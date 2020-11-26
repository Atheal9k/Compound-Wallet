import { useState, useEffect } from "react";
import Wallets from "../contracts/Wallets.json";
import daiAbi from "../abis/dai_abi.js";
import compoundCDaiContractAbi from "../abis/compoundCDai_abi.js";
import "../css/style.css";
import Link from './Link'
import DepositDai from './DepositDai';



const assetName = "DAI";
const contractAddress = "0x626acb7D3feB20c0a57e9ef88aEE1c9C3aF03578";
const daiMainNetAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const compoundCDaiContractAddress =
  "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643";

const Compound = (props) => {
  const [web3, setWeb3] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [daiContract, setDaiContract] = useState(undefined);
  const [compoundCDaiContract, setCompoundCDaiContract] = useState(undefined);
  const [fromMyWallet, setFromMyWallet] = useState(undefined);

  const sendDaiToWallet = async () => {
    console.log(
      `Now transferring ${assetName} from my wallet to MyContract...`
    );
    

    let transferResult = await props.daiContract.methods
      .transfer(contractAddress, props.web3.utils.toHex(150 * Math.pow(10, 18)))
      .send(props.fromMyWallet);

    console.log(
      `MyContract now has ${assetName} to supply to the Compound Protocol.`
    );
  };

  const supplyToCompound = async () => {
    console.log(`MyContract is now minting c${assetName}...`);
    let aaa = await daiContract.methods.approve(
      compoundCDaiContractAddress,
      web3.utils.toHex(10 * Math.pow(10, 18))
    );
    let supplyResult = await contract.methods
      .supplyDAIToCompound(
        daiMainNetAddress,
        compoundCDaiContractAddress,
        web3.utils.toHex(10 * Math.pow(10, 18))
      )
      .send(fromMyWallet);
    console.log(`Supplied ${assetName} to Compound via MyContract`);
    console.log(supplyResult);
    console.log(supplyResult.events.MyLog);
  };

  const balanceInCompound = async () => {
    let balanceOfDaiInCompound = await compoundCDaiContract.methods
      .balanceOfUnderlying(contractAddress)
      .call();
    const daiForReading = web3.utils.fromWei(balanceOfDaiInCompound);
    console.log(
      `${assetName} supplied to the Compound Protocol:`,
      daiForReading
    );

    var cDaiBalance = await compoundCDaiContract.methods
      .balanceOf(contractAddress)
      .call();
    cDaiBalance = cDaiBalance / 1e8;
    console.log(`MyContract's c${assetName} Token Balance:`, cDaiBalance);
    return cDaiBalance;
  };

  const checkDaiBalance = async () => {
    let transferResult = await props.daiContract.methods
      .balanceOf(contractAddress)
      .call();
    const daiForReading = props.web3.utils.fromWei(transferResult);
    console.log(daiForReading);
  };

  const redeemCDAITokens = async () => {
    // get balance back
    var cDaiBalance = await compoundCDaiContract.methods
      .balanceOf(contractAddress)
      .call();
    cDaiBalance = cDaiBalance / 1e8;

    const amount = web3.utils.toHex(cDaiBalance * 1e8);
    const redeemType = true;
    console.log(`Redeeming the c${assetName} for ${assetName}...`);

    let redeemResult = await contract.methods
      .redeemCDai(amount, redeemType, compoundCDaiContractAddress)
      .send(fromMyWallet);

    // if (redeemResult.events.MyLog.returnValues[1] != 0) {
    //   throw Error('Redeem Error Code: '+redeemResult.events.MyLog.returnValues[1]);
    // }

    cDaiBalance = await compoundCDaiContract.methods
      .balanceOf(contractAddress)
      .call();
    cDaiBalance = cDaiBalance / 1e8;
    console.log(`MyContract's c${assetName} Token Balance:`, cDaiBalance);
  };

  return (
    <div>
       
      <div className="sectionMenu">
        <section className="menu">
        <Link href="/deposit" className="link-item">       
                <div className="btn-primary inline-page">
                    <div className="title">
                    
                        <p><i class="fas fa-university fa-1x"></i>Deposit Dai</p>
                        
                    </div>
                  
                </div>
                 </Link>
                 <Link href="/dai-balance" className="link-item">
                
                <div className="btn-primary">
                    <div className="title">
                    
                        <p><i class="fa fa-credit-card fa-1x"></i>Dai Balance</p>
                    </div>
                </div>
                </Link>
                <Link href="/send-to-compound" className="link-item">
                
                <div className="btn-primary">
                    <div className="title">
                    
                        <p><i class="fas fa-paper-plane fa-1x"></i>Send To Compound</p>
                    </div>
                </div>
                
                </Link>
                <Link href="/compound-balance" className="link-item">
                
                <div className="btn-primary">
                    <div className="title">
                    
                        <p><i class="fa fa-user-circle"></i>Compound Balance</p>
                    </div>
                </div>
                </Link>
                <Link href="/redeem-cdai" className="link-item">
                
                <div className="btn-primary">
                    <div className="title">
                   
                        <p><i class="fas fa-shopping-cart fa-1x"></i>Redeem cDai</p>
                    </div>
                </div>
                </Link>

                <footer class="footer">
            <div class="social">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-youtube"></i></a>
            <a href="#"><i class="fab fa-linkedin"></i></a>
        </div>
        <p>Copyright &copy; 2020 Compound Wallet</p>
    </footer>
    </section>

    
            </div>

            
    </div>
  );
};

export default Compound;
