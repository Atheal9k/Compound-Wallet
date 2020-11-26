import React, {useState} from 'react';
import SendValueToBlockchain from './SendValueToBlockchain';
import compound from './compound';

const DepositDai = ({deposit}) => {




    return (
        <div className="mainContent">
            <div className="innerMainContent">
            <img className="page-logos" src="/images/dai-logo.png" alt="dai-logo" />
            <SendValueToBlockchain deposits={deposit}/>
            </div>
        </div>
    )
}

export default DepositDai;