
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

const providerOptions = {

  walletconnect: {

    package: WalletConnectProvider,

    options: {
      rpc: {
        1: 'https://mainnet.infura.io/v3/d6365a4a20484a97ab016730dc4a601f',
        137: 'https://rpc-mainnet.maticvigil.com/',
        56: 'https://bsc-dataseed1.binance.org/'
      }
    }

  },

  coinbasewallet: {

    package: CoinbaseWalletSDK,
    options: {

      rpc: {
        1: 'https://mainnet.infura.io/v3/d6365a4a20484a97ab016730dc4a601f',
        137: 'https://rpc-mainnet.maticvigil.com/',
        56: 'https://bsc-dataseed1.binance.org/'
      }

    }

  }

}

export default providerOptions
