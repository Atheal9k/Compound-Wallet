import React from 'react';


const CheckBalanceButton = ({showBalances}) => {
    
    
    const refreshBalance = (event) => {
        event.preventDefault();
        showBalances();
    }


    return (
        <div className="refresh-btn">
        <button onClick={refreshBalance} className="btn-refresh">Refresh Balance</button>
        </div>
    )
}

export default CheckBalanceButton;