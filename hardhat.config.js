require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config()
require('hardhat-deploy')

//给验证合约设置代理
const {setGlobalDispatcher,ProxyAgent} = require("undici")
const proxyAgent = new ProxyAgent('http://127.0.0.1:7897')
setGlobalDispatcher(proxyAgent)

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY1 = process.env.PRIVATE_KEY1
const ETHER_API_KEY = process.env.ETHER_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks : {
    sepolia : {
      // 太坊节点的 JSON-RPC 端点
      // url 是一个指向以太坊节点的接口地址，它允许你的 Hardhat 项目通过 JSON-RPC 协议与以太坊网络通信。
      // JSON-RPC 是一种远程过程调用协议，允许客户端（如 Hardhat）向以太坊节点发送请求并接收响应。
      url : SEPOLIA_URL,
      // 账户私钥
      // 私钥对应于你希望用来发送交易的以太坊账户。这意味着你可以使用这些账户来支付 gas 费用、部署合约、调用合约方法等。
      accounts : [PRIVATE_KEY1],
      // 链ID在 https://chainlist.org/?testnets=true&search=ethereum 中找
      chainId : 11155111,
    }
  },
  etherscan: {
    apiKey: {
      sepolia: ETHER_API_KEY
    }
  },
  namedAccounts: {
    firstAccount: {
      default: 0
    },
    secondAccount: {
      default: 1
    },
  },
};  
