
import { useEffect, useState } from 'react'
import providerOptions from '../../utils/providerOptions'
import Web3Modal from 'web3modal'
import Web3 from "web3";
import axios from 'axios'
import '../../assets/Stylesheets/Manual.css'

const Manual = () => {

    let orderId = localStorage.getItem('orderId')
    let payMode = localStorage.getItem('payMode')
    let [ismaticverified, setIsmaticverified] = useState(false)
    let [isTbacverified, setIsTbacverified] = useState(false)
    let [maticTx, setMaticTx] = useState(null)
    let [tbacTx, setTbacTx] = useState(null)
    let [user, setUser] = useState(null)
    let [disAb, setDisAb] = useState(false)
    let w3

    async function connectWeb3() {

        let web3Modal = new Web3Modal({

            network: "mainnet",
            cacheProvider: true,
            providerOptions

        });

        const web3ModalInstance = await web3Modal.connect()
        const web3ModalProvider = new Web3(web3ModalInstance)
        return web3ModalProvider


    }


    //FinalUpdate
    async function finalUpdate(custId) {

        try {

            setDisAb(true)
            let dotNet = await axios({
                method: 'put',
                url: `https://fifityfifty.herokuapp.com/sqlFinalTr`,

                data: {

                    OrderID: orderId,
                    custId,
                    payMode: 2,
                    Final_Status: 1

                }

            })

            if (dotNet.data.status === true) {
                localStorage.clear()
                window.location.replace(`https://user.defiai.io/buy5050dapp.aspx?Status=1&Message=Successfully Purchased&orderid=${orderId}`)
            }

            await axios({

                method: 'put',
                url: 'https://fifityfifty.herokuapp.com/update',
                data: {
                    OrderID: orderId,
                    custId,
                    payMode: 2,
                    final_status: true
                }

            })

        } catch (error) {

        }
    }



    useEffect(() => {

        axios({

            method: 'get',
            url: `https://fifityfifty.herokuapp.com/${orderId}/${payMode}/sqlData`

        }).then(x => setUser(x.data.data)).catch(e => console.log(e))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const setMatic = (e) => {
        e.preventDefault()
        setMaticTx(e.target.value)
    }

    const setTbac = (e) => {
        e.preventDefault()
        setTbacTx(e.target.value)
    }


    const verifyMatic = async () => {

        try {

            if (!maticTx) {
                return alert('please Enter a valid Transaction Hash')
            }

            w3 = await connectWeb3()
            const chainId = await w3.eth.getChainId()

            if (chainId !== 137) {
                localStorage.clear()
                alert(`please connect to polygon mainNet`)
            }

            let resp = await axios({

                method: 'get',
                url: `https://fifityfifty.herokuapp.com/${orderId}/${payMode}/sqlData`

            })

            console.log(resp.data.data)

            let reciept = await w3.eth.getTransaction(maticTx)
            console.log(reciept)

            if (!reciept) {
                return alert('unable To Verify Transaction')
            }

            if (reciept) {

                let actualPayed = (reciept['value'] / 1000000000000000000)

                if (actualPayed) {
                    actualPayed.toFixed(5)
                }

                console.log(actualPayed)

                let expected = resp.data.data['Coin1_Paid']

                if (expected) {
                    expected.toFixed(5)
                }


                console.log(expected)

                if (expected >= actualPayed) {

                 
                    let c1resp = await axios({
                        method: 'put',
                        url: `https://fifityfifty.herokuapp.com/sqlCoin1Tr`,

                        data: {

                            OrderID : orderId,
                            payMode: 2,
                            Coin1_Tx: reciept.transactionHash,
                            Coin1_Status: 1 ,
                            Coin1_Amt : resp.data.data.Coin1_Amt

                        }

                    })

                    if (c1resp) {
                        setIsmaticverified(true)
                        alert('matic tr verified')
                    }

                } else {
                    return alert('ammount did not matched')
                }


            }

        } catch (error) {
            console.log(error)
        }

    }

    const verifyTbac = async () => {

        try {

            if (!tbacTx) {
                return alert('please Enter a valid Transaction Hash')
            }

            let resp = await axios({

                method: 'get',
                url: `https://fifityfifty.herokuapp.com/${orderId}/${payMode}/sqlData`

            })

            console.log(resp.data.data['FromAddress'])
            let expectedAmt = resp.data.data.Coin2_Paid


            let res = await axios({
                method: 'post',
                url: `https://onlyMatic.herokuapp.com/verifyTbacTR`,
                data: {
                    transactionHash: tbacTx
                }
            })
            console.log(res)

            let payedAmt = res.data.data.data.amount
            let payFromAddress = res.data.data.data.sender
            let payedTo = res.data.data.data.receiver


            if ((payFromAddress.toLowerCase()) !== (resp.data.data.FromAddress.toLowerCase())) {
                return alert('from and to address does not matched')
            }

            if ((payedTo.toLowerCase()) !== resp.data.data.ToAddress.toLowerCase()) {
                return alert('from and to address does not matched')
            }

            if (payedAmt >= expectedAmt) {

                let c2resp = await axios({
                    method: 'put',
                    url: `https://fifityfifty.herokuapp.com/sqlCoin2Tr`,

                    data: {

                        OrderID : orderId,
                        Coin2_Paid: res.data.data.data['amount'],
                        FromAddress: res.data.data.data['sender'],
                        ToAddress: res.data.data.data['receiver'],
                        Coin2_Tx: tbacTx,
                        Coin2_Status: 1,
                        Coin2_Amt : resp.data.data.Coin2_Amt

                    }

                })

                if (c2resp) {
                    alert(`transactionHash verified`)
                    setIsTbacverified(true)
                }


            } else {
                alert('unable To Verify Transaction')
            }



        } catch (error) {
            console.log(error)
        }

    }

    console.log(user)


    return (

        !user ? <div> Loading... </div> :

            <div className='col-md-6 mx-auto mt-6'>
                <div style={{
                    border: "2px solid black",
                    padding: "20px",
                    borderRadius: "7px",
                    marginTop: "10px"
                }}>

                    <div>
                        <p> Total Amount = {user.Total_Amt} </p>
                    </div>

                    <form>
                        <div className='col-md-12'>
                            {
                                (!user) ? <div> LOading... </div> :
                                    user['Coin1_Tx'] === 'n/a' ?
                                        <>
                                            <label htmlFor="fname">Transaction Hash(Matic)</label>
                                            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                                <input className='formInput' type="text" placeholder="Matic tx hash" onChange={setMatic} />&nbsp;&nbsp;
                                                <div className='btn btn-success' style={{ height: '40px' }} onClick={verifyMatic} > Matic </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <label htmlFor="fname">Matic Transaction Completed</label>
                                            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                                <input className='formInput' type="text" placeholder={user['Coin1_Tx']} />&nbsp;&nbsp;
                                                <div className='btn btn-success' style={{ height: '40px' }} > Completed </div>
                                            </div>
                                        </>

                            }


                            {user['Coin2_Tx'] === 'n/a' ?
                                <>
                                    <label htmlFor="lname">Enter TBAC Transaction Hash</label>
                                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                        <input className='formInput' type="text" placeholder="Transaction Hash TBAC." onChange={setTbac} />&nbsp;&nbsp;
                                        <div className='btn btn-success' style={{ height: '40px' }} onClick={verifyTbac}> TBAC </div>
                                    </div>
                                </>
                                :
                                <>
                                    <label htmlFor="lname">TBAC Transaction Completed</label>
                                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                        <input className='formInput' type="text" placeholder={user['Coin2_Tx']} />&nbsp;&nbsp;
                                        <div className='btn btn-success' style={{ height: '40px' }}> Completed </div>
                                    </div>
                                </>
                            }


                        </div>

                        {

                            ismaticverified && isTbacverified ? <div>
                                <button disabled={disAb} className='btn btn-primary' onClick={finalUpdate(user['custid'])}> Stake Now </button>
                            </div> : null

                        }


                    </form>
                </div>
            </div>

    );

}

export default Manual