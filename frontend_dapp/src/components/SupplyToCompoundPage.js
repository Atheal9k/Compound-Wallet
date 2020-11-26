import React, {useState} from 'react';
import compound from './compound';
import SendValueToBlockchain from './SendValueToBlockchain';

const SupplyToCompoundPage = ({deposit}) => {


    return (
        <div className="mainContent">
            <div className="innerMainContent">
            <img className="page-logos" src="/images/compound-logo.png" alt="compound-logo" />
            <SendValueToBlockchain deposits={deposit}/>
            </div>
        </div>
    )
}


export default SupplyToCompoundPage;