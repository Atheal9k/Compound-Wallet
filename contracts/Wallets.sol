pragma solidity ^0.5.0;
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './IUniswapV2Router02.sol';

interface IYDAI {
    function deposit (uint _amount) external;
    function withdraw(uint _shares) external;
    function balanceOf(address account) external view returns (uint);
    function getPricePerFullShare() external view returns (uint);
}

interface CERC20 {
    function mint(uint256) external returns (uint256);
    function exchangeRateCurrent() external returns(uint256);
    function supplyRatePerBlock() external returns(uint256);
    function redeem(uint) external returns(uint);
    function redeemUnderlying(uint) external returns(uint);
}



// interface LendingPoolAddressesProvider {
//     function deposit( address _reserve, uint256 _amount, uint16 _referralCode) external;
//     function getLendingPool() external view returns (address) ;
//     function getLendingPoolCore() external view returns (address payable) ;
// }

// interface LendingPool{
//     function deposit( address _reserve, uint256 _amount, uint16 _referralCode) external;
// }

contract Wallets {
    address admin;
    IERC20 dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    IYDAI yDai = IYDAI(0xC2cB1040220768554cf699b0d863A3cd4324ce32);
    CERC20 cDai = CERC20(0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643);
    uint public num1;

    IUniswapV2Router02 uniswap;
    

    // Retrieve LendingPool address
    // LendingPoolAddressesProvider provider;  // mainnet address, for other addresses: https://docs.aave.com/developers/developing-on-aave/deployed-contract-instances
    // LendingPool lendingPool;

    // address ETHER = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    // uint256 amount = 10 * 1e18;
    // uint16 referral = 0;

    constructor() public {
       // address uniswapAddress, address daiAddress
        admin = msg.sender;
        //uniswap = IUniswapV2Router02(uniswapAddress);
        //dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
        //cDai = CERC20(0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643);
    }

    function save(uint amount) external payable {
        dai.transferFrom(msg.sender, address(this), amount);
        _save(amount);
        
    }

    function spend(uint amount, address recipient) external {
        require(msg.sender == admin, 'only admin');
        uint balanceShares = yDai.balanceOf(address(this));
        yDai.withdraw(balanceShares);
        dai.transfer(recipient, amount);
        uint balanceDai = dai.balanceOf(address(this));
        if(balanceDai>0){
            _save(balanceDai);
        }
    }

    function _save(uint amount) internal {
        dai.approve(address(yDai), amount);
        yDai.deposit(amount);
    }

    function balance() external view returns(uint) {
        uint price = yDai.getPricePerFullShare();
        uint balanceShares = yDai.balanceOf(address(this));
        return balanceShares * price;
    }

    function setTest(uint num) public{
        num1 = num;
    }

    function getTest() public view returns(uint){
        return num1;
    }

    function supplyDAIToCompound(address dai, address cDai, uint256 _numTokensToSupply) public returns (uint){
        IERC20 underlying = IERC20(dai);
        CERC20 cToken = CERC20(cDai);
        
         uint256 exchangeRateMantissa = cToken.exchangeRateCurrent();
        // emit MyLog("Exchange Rate (scaled up): ", exchangeRateMantissa);

         uint256 supplyRateMantissa = cToken.supplyRatePerBlock();
        // emit MyLog("Supply Rate: (scaled up)", supplyRateMantissa);

        

        underlying.approve(address(cDai), _numTokensToSupply);

        uint mintResult = cToken.mint(_numTokensToSupply);
        return mintResult;
    }

    function redeemCDai(uint256 amount, bool redeemType, address cDai) public returns (bool) {
        CERC20 cToken = CERC20(cDai);

        uint256 redeemResult;

        if(redeemType == true) {
            redeemResult = cToken.redeem(amount);
        }
        else {
            redeemResult = cToken.redeemUnderlying(amount);
        }

        return true;
    }

    function() external payable {}

    

}