pragma solidity 0.6.12;
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { FlashLoanReceiverBase } from "./flashloan/base/FlashLoanReceiverBase.sol";

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

interface LendingPoolAddressesProvider {
    function getLendingPool() external view returns (address);
}

interface LendingPool{
    function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external;
    function flashLoan(address receiverAddress, address[] calldata assets, uint256[] calldata amounts, uint256[] calldata modes, address onBehalfOf, bytes calldata params, uint16 referralCode) external;
}



contract Wallets is FlashLoanReceiverBase {
    address admin;
    IERC20 dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    IYDAI yDai = IYDAI(0xC2cB1040220768554cf699b0d863A3cd4324ce32);
    CERC20 cDai = CERC20(0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643);
    LendingPoolAddressesProvider provider = LendingPoolAddressesProvider(0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5);
    LendingPool lendingPool;
    uint public flashLoanedAmount;
    address _provider;
    

    //IUniswapV2Router02 uniswap;
    event MyLog(string s, uint256 _value);

    // Retrieve LendingPool address
    // LendingPoolAddressesProvider provider;  // mainnet address, for other addresses: https://docs.aave.com/developers/developing-on-aave/deployed-contract-instances
    // LendingPool lendingPool;

    // address ETHER = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    // uint256 amount = 10 * 1e18;
    // uint16 referral = 0;

    constructor() FlashLoanReceiverBase(_provider) public {
        _provider = getLendingAddress();
        LendingPool lendingPool = LendingPool(_provider);
        admin = msg.sender;
        

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

    
    function supplyDAIToCompound(address dai, address cDai, uint256 _numTokensToSupply) public returns (uint){
        IERC20 underlying = IERC20(dai);
        CERC20 cToken = CERC20(cDai);
        
         uint256 exchangeRateMantissa = cToken.exchangeRateCurrent();
         emit MyLog("Exchange Rate (scaled up): ", exchangeRateMantissa);

         uint256 supplyRateMantissa = cToken.supplyRatePerBlock();
         emit MyLog("Supply Rate: (scaled up)", supplyRateMantissa);

        

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

    function getLendingAddress() public view returns (address){
        return provider.getLendingPool();
    }

    function depositToAave(address dai, uint256 amount, address to) public {
        IERC20 underlying = IERC20(dai);
         //address _provider = getLendingAddress();
        // LendingPool lendingPool = LendingPool(_provider);
        underlying.approve(_provider, amount);
        lendingPool.deposit(address(dai), amount, to, 0);
        emit MyLog("Deposited into Aave", amount);
    }

    function borrowFromAave(uint256 amount) public {
       // address _provider = getLendingAddress();
        address underlyingAsset = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
        //LendingPool lendingPool = LendingPool(_provider);
        lendingPool.borrow(underlyingAsset, amount, 2, 0, address(this));

    }

    function startFlashLoan(address[] calldata assets, uint256[] calldata amounts) public {
       // address _provider = getLendingAddress();
       //  LendingPool lendingPool = LendingPool(_provider);

        address receiverAddress = address(this);

        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        address onBehalfOf = address(this);

        bytes memory params = "";

        lendingPool.flashLoan(address(this), assets, amounts, modes, onBehalfOf, params, 0);
    }

    function executeOperation(address[] calldata assets, uint256[] calldata amounts, uint256[] calldata premiums, address initiator, bytes calldata params) external override returns (bool) {




        // Approve the LendingPool contract allowance to *pull* the owed amount
        for (uint i=0; i < assets.length; i++) {
            uint amountOwing = amounts[i].add(premiums[i]);
            flashLoanedAmount = amounts[i];
            IERC20(assets[i]).approve(address(lendingPool), amountOwing);
        }

        return true;
    }

    //function() external payable {}

    

}