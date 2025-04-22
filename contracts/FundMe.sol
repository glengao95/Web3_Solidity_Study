// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

//1.接受资产
//2.记录投资人，能查看投资人投资
//3.指定时间内，达到目标值，生产商可以取款
//4.指定时间内，未达到目标值，投资人扣款
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";


contract FundMe {

    mapping(address => uint256) public fundAmtToAddr;//记录funder的金额

    uint256 constant FUND_TARGET = 500 * 10 ** 18 ;//目标价格500USD，乘10 ** 18因为传msg.value单位是wei

    uint256 constant MIN_VALUE = 1 * 10 ** 18;

    AggregatorV3Interface internal dataFeed;

    address public owner;//所有者

    uint256 deployTimestamp;//合同发布时间

    uint256 lockTime;//锁定时间

    address tokenAddr;//合同用到的token 的发布地址

    bool public fundFlag; //记录合同是否已经fund成功

    constructor (uint _lockTime, address dataFeedAddr) {
        owner = msg.sender;
        dataFeed = AggregatorV3Interface(dataFeedAddr); 
        deployTimestamp = block.timestamp;
        lockTime = _lockTime;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "You are not owner");
        _;
    }

    function fund() external payable {
        require(converEthToUSD(msg.value) >= MIN_VALUE, "Not enough balance");
        require(block.timestamp < (deployTimestamp + lockTime), "contract is locked");
        fundAmtToAddr[msg.sender] += msg.value;
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function converEthToUSD(uint256 _amt) public view returns(uint256){
        //得到结果不带小数，他的精度是10 ** 8，比如ETH / USD, 1 ETH = 1435.94234265 USD，得到的结果就是143594234265
        uint256 ethPrice = uint(getChainlinkDataFeedLatestAnswer());
        //需要除去10 ** 8， 得到真实的等价的美元价格
        return _amt * ethPrice / (10 ** 8);
    } 


    function getFund() external onlyOwner {
        require(converEthToUSD(address(this).balance) >= FUND_TARGET, "Target is not reached");
        require(block.timestamp > (deployTimestamp + lockTime), "contract is unlocked");

        //默认地址不是payable address类型的，需要转换
        //transfer
        // payable(msg.sender).transfer(address(this).balance);
        //send 
        // bool success = payable(msg.sender).send(address(this).balance);
        //call
        bool success;
        (success, ) = payable(msg.sender).call{value : address(this).balance}("");
        require(success, "tx failed");
        fundFlag = true;
    }

    function transferOwnership(address newOwner) external onlyOwner{
        owner = newOwner;
    }

    function refund() external {
        require(converEthToUSD(address(this).balance) < FUND_TARGET, "Target is reached");
        require(block.timestamp > (deployTimestamp + lockTime), "contract is unlocked");
        uint256 senderAmout = fundAmtToAddr[msg.sender];
        require(senderAmout > 0, "You have no amount");
        fundAmtToAddr[msg.sender] = 0;
        bool success;
        (success, ) = payable(msg.sender).call{value : senderAmout}("");
        require(success, "tx failed");
    }

    function setFundAmtToAddr(address _funder, uint256 _amount) external{
        require(msg.sender == tokenAddr);//只能是token地址调用 防止其他人修改
        fundAmtToAddr[_funder] = _amount;
    }

    function setTokenAddr(address _tokenAddr) public onlyOwner {
        tokenAddr = _tokenAddr;
    }

}