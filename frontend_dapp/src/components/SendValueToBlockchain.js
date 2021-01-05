import {useState, useContext} from 'react';
import ConnectWallet from './ConnectWallet'
import {ConnectedContext} from './App'

const SendValueToBlockchain = ({deposits}) => {
    const [amount, setAmount] = useState('');

    const {isConnected, setIsConnected} = useContext(ConnectedContext)
    console.log(isConnected)

    const updateValue = (event) => {
        event.preventDefault();
        setAmount(event.target.value);
    }

    const submitValue = (event) => {
        event.preventDefault();
        console.log(amount)
        deposits(amount);
    }


    return (
        <div>
            <form onSubmit={submitValue} className="form-submit">
                <input type="text" placeholder="Enter Amount" value={amount} onChange={updateValue} className="input-send"/>
                {isConnected === 'disconnected' ? <ConnectWallet /> : <button className="btn-send">Send</button>}
            </form>
        </div>
    )
}

export default SendValueToBlockchain;