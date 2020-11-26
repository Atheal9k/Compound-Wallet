import React, {useState} from 'react';
import compound from './compound';
import SendValueToBlockchain from './SendValueToBlockchain';

const RedeemTokensPage = ({deposit}) => {
    return (
        <div className="mainContent">
            <div className="innerMainContent">
            <img className="page-logos" src="/images/cDai-logo.png" alt="cDai-logo" />
            <SendValueToBlockchain deposits={deposit}/>
            </div>
        </div>
    )
}


export default RedeemTokensPage;