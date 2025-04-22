// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {FundMe} from "./FundMe.sol";

contract FundTokenERC20 is ERC20{
    FundMe fundMe;
    
    constructor(address _fundMeAddr) ERC20("FundMeToken", "FMT"){
        fundMe = FundMe(_fundMeAddr);
    }

    function mint(uint256 _amount) external {
        require(fundMe.fundAmtToAddr(msg.sender) >= _amount, "You dont have enough amount");
        require(fundMe.fundFlag(), "Fund is not completed yet");
        _mint(msg.sender, fundMe.fundAmtToAddr(msg.sender));
        fundMe.setFundAmtToAddr(msg.sender, fundMe.fundAmtToAddr(msg.sender) - _amount);
    }

    function calim(uint _token) external {
        require(balanceOf(msg.sender) >= _token, "You dont have enough token");
        require(fundMe.fundFlag(), "Fund is not completed yet");

        //兑换一些东西...

        //烧掉token
        _burn(msg.sender, _token);
    }

}