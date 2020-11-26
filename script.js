const Web3 = require('web3');
const daiAbi = require('./abi.js');

const recipientAddress = "0xB09B90Ca05252F707Dc93b81e64A8140FC9Bb228";
const unlockedAddress = "0x912fD21d7a69678227fE6d08C64222Db41477bA0";
const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f"; 

const web3 = new Web3('http://localhost:8545'); 
const dai = new web3.eth.Contract(
  daiAbi,
  daiAddress
);

async function run() {
  let unlockedBalance, recipientBalance;

  ([unlockedBalance, recipientBalance] = await Promise.all([
    dai.methods
      .balanceOf(unlockedAddress)
      .call(),
    dai.methods
      .balanceOf(recipientAddress)
      .call()
  ]));
  console.log(`Balance unlocked: ${unlockedBalance}`);
  console.log(`Balance recipient: ${recipientBalance}`);

  await dai.methods
  .transfer(recipientAddress, 1000)
  .send({from: unlockedAddress});

//   ([unlockedBalance, recipientBalance] = await Promise.all([
//     dai.methods
//       .balanceOf(unlockedAddress)
//       .call(),
//     dai.methods
//       .balanceOf(recipientAddress)
//       .call()
//   ]));
//   console.log(`Balance unlocked: ${unlockedBalance}`);
//   console.log(`Balance recipient: ${recipientBalance}`);
}

run();