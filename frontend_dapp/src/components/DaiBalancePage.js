import React, {useState, useEffect} from 'react';
import CheckBalanceButton from './CheckBalanceButton';


const DaiBalancePage = ({checkBalance, daiBalance}) => {

    const showBalance = async () => {
        const balances = checkBalance().then(result => {
            console.log("success")
            
        }).catch(err => {
            console.log('failed')
        })
    }


    return (
        <div className="mainContent">
            <div className="innerMainContent">
            <label className="balanceLabel">Total Dai:</label>
            <div className="balances">{daiBalance}</div>
            <CheckBalanceButton showBalances={showBalance}/>
            </div>
        </div>
    )
}


export default DaiBalancePage;