

const networks = {

  polygon: {

    chainId: `0x${Number(137).toString(16)}`,
    chainName: `Polygon mainnet`,

    nativeCurrency: {

      name: `MATIC`,
      symbol: `MATIC`,
      decimals: 18

    },

    rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
    blockExplorerUrls: [`https://polygonscan.com/`]

  },

  binance: {

    chainId: `0x${Number(56).toString(16)}`,
    chainName: `Binance Smart Chain Mainnet`,

    nativeCurrency: {

      name: `BNB`,
      symbol: `BNB`,
      decimals: 18

    },

    rpcUrls: ['https://bsc-dataseed1.binance.org/'],
    blockExplorerUrls: [`https://bscscan.com`]


  }

}

export default networks