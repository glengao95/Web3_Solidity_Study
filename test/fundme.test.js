const { ethers, deployments, getNamedAccounts } = require("hardhat")
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const { assert, expect } = require("chai")

describe("test fundMe contract", async function () {
    let fundMe
    let firstAccount
    beforeEach(async function() {
        //部署所有tag为all的合约
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        //获取FundMe合约部署对象
        const fundMeDeployment = await deployments.get("FundMe")
        //得到fundMe合约
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
    })

    it("test if the owner is msg.sender", async function() {
        // 等待合约部署完成 成功入块
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.owner()), firstAccount)
     
    })

    /**    fund方法测试    **/
    //模拟窗口关闭
    it("window closed, value grater than minimum, fund failed", 
        async function() {
            // 推进200秒
            await helpers.time.increase(200)
            await helpers.mine()
            //返回的错误等于 contract is locked，表示成功
            await expect(fundMe.fund({value: ethers.parseEther("0.1")}))
                .to.be.revertedWith("contract is locked")
        }
    )

    //模拟金额未达到最小值
    it("window open, value is less than minimum, fund failed", 
        async function() {
            //返回的错误等于 Not enough balance，表示成功
            await expect(fundMe.fund({value: ethers.parseEther("0.0001")}))
                .to.be.revertedWith("Not enough balance")
        }
    )

    //模拟fund成功
    it("Window open, value is greater minimum, fund success", 
        async function() {
            // greater than minimum
            await fundMe.fund({value: ethers.parseEther("0.1")})
            const balance = await fundMe.fundAmtToAddr(firstAccount)
            //金额相等 则成功
            await expect(balance).to.equal(ethers.parseEther("0.1"))
        }
    )

})