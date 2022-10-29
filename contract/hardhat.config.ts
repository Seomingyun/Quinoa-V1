import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig | {} = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1_0,
        details: {
          yul: false
        }
      }
    }
  },
  networks: {
    hardhat: {
      accounts: {
        count: 20,
      },
      // chainId: 1337,
      chainId: 137,
      forking: {
        url: process.env.ALCHEMY_MATIC_URL || "https://polygon-rpc.com/",
        blockNumber : 34624917
      },
      loggingEnabled: true
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mainnet: {
      url: process.env.MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    matic: {
      url: process.env.MATIC_URL || "https://polygon-rpc.com/",
      accounts: [process.env.PRIVATE_KEY1]
    },
    mumbai : {
      url: process.env.MUMBAI_URL || "https://rpc-mumbai.maticvigil.com/",
      accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY1, process.env.PRIVATE_KEY2]
    },
    cypress: {
      url: process.env.KLAYTN_URL || "https://public-node-api.klaytnapi.com/v1/cypress",
      gasPrice: 250000000000,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    baobab: {
      url: process.env.KLAYTN_URL || "https://public-node-api.klaytnapi.com/v1/baobab",
      gasPrice: 250000000000,
      accounts:
        process.env.PRIVATE_KEY1 !== undefined ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY1] : [process.env.PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  typechain: {
    alwaysGenerateOverloads: true,
  },
};

export default config;
