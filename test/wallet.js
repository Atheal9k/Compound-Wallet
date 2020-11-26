const Wallet = artifacts.require('Wallet.sol');

contract("Wallet", async () => {
    it("should work correctly", async () => {
        let instance = await Wallet.deployed();
        instance.save({value: web3.utils.toWei("1", ether)})
    })
})