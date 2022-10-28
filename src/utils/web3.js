import Web3 from 'web3';
import Web3Modal from 'web3modal'
import networks from './network';
import providerOptions from './providerOptions'

let w3

async function connectWallet() {

    try {

        let web3Modal = new Web3Modal({

            cacheProvider: false,
            providerOptions,
            chainId: 137

        });

        const web3ModalInstance = await web3Modal.connect();
        const web3ModalProvider = new Web3(web3ModalInstance)

        w3 = web3ModalProvider

        let chainId = await w3.eth.getChainId()
        if (chainId !== 137) {

            await w3.eth.currentProvider.request({

                method: 'wallet_addEthereumChain',
                params: [
                    {
                        ...networks['polygon']
                    }
                ]

            })

        }

        return w3

    } catch (error) {
        console.log(error)
    }

}


const activeAccount = async (w3) => {
    return await w3.eth.getAccounts
}

export { connectWallet, activeAccount }
