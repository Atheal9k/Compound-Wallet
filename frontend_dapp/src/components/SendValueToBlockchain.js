import {useState} from 'react';
import compound from './compound';

const SendValueToBlockchain = ({deposits}) => {
    const [amount, setAmount] = useState('');

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
                <button className="btn-send">Send</button>
            </form>
        </div>
    )
}

export default SendValueToBlockchain;