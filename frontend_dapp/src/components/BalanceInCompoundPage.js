import React, {useState, useEffect} from 'react';
import CheckBalanceButton from './CheckBalanceButton';

const BalanceInCompoundPage = ({checkBalance, cDaiBalance}) => {
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
            <label className="balanceLabel">Total cDai:</label>
            <div className="balances">{cDaiBalance}</div>
            <CheckBalanceButton showBalances={showBalance}/>
            </div>
        </div>
    )
}


export default BalanceInCompoundPage;