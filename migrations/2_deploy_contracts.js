var Wallets = artifacts.require("./Wallets.sol");

module.exports = function(deployer) {
  deployer.deploy(Wallets);
};
