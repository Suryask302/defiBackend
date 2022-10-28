import React, { useEffect, useState } from 'react'
import '../assets/Stylesheets/Trpage.css'
import axios from 'axios'
import { ethers } from 'ethers'
import moment from 'moment'
import { Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import { Loader, Placeholder } from 'rsuite';
let now = moment()


const TrpageCoin1 = (props) => {

    let [matic, setMatic] = useState(0)
    let [err, setErr] = useState(null)
    let [loading, setLoading] = useState(false)
    let [isDisabled, setIsDisabled] = useState(false)
    let report = ""

    let [tr1data, setTrdata] = useState({
        status: '', trHash: '', apires: '', dateTime: ''
    })

    let { custid, OrderID, Total_Amt, Coin1 } = props.data
    let w3 = props.we

    useEffect(() => {

        (async () => {

            let maticRate = await axios({
                method: "get",
                url: "https://api.pancakeswap.info/api/v2/tokens/0xCC42724C6683B7E57334c4E856f4c9965ED682bD"
            })

            let maticPrice = parseFloat(maticRate.data.data.price)
            setMatic(maticPrice.toFixed(5))

        })()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function toMongoCoin1(params) {

        try {

            await axios({

                method: 'put',
                url: "https://fifityfifty.herokuapp.com/coin1Tr",
                data: {
                    OrderID,
                    ...params
                }

            })

        } catch (error) {

        }
    }

    async function finalUpdate() {

        try {

            setIsDisabled(true)

            await axios({
                method: 'put',
                url: `https://fifityfifty.herokuapp.com/sqlFinalTr`,
                data: {
                    OrderID,
                    custid,
                    payMode: 1,
                    Final_Status: (tr1data.status) ? 1 : 2
                }
            })


            localStorage.clear()
            window.location.replace(`https://user.defiai.io/buy100dapp.aspx?Status=1&Message=Successfully Purchased&orderid=${OrderID}`)


        } catch (error) {

        }
    }

    async function maticTransaction() {

        try {

            setLoading(true)
            function checkTransactionConfirmation(txhash) {

                const checkTransactionLoop = () => {
                    return w3.eth.currentProvider.request({ method: "eth_getTransactionReceipt", params: [txhash] }).then(reciept => {

                        if (reciept !== null) {

                            (async function () {

                                report = await w3.eth.getTransaction(txhash)

                                if (Number(report.value / 1000000000000000000) !== Number(maticPrice)) {
                                    setErr('mutation in transaction Amount ..!')
                                }

                                if (report['to'].toLowerCase() !== '0xFAe130F5E0dB53fCB3C0fd19bc9F20Cb7625a8E5'.toLowerCase()) {
                                    setErr('mutation in Address..!')
                                }


                            })();

                            async function coin1resp() {

                                try {

                                    let c1resp = await axios({
                                        method: 'put',
                                        url: `https://fifityfifty.herokuapp.com/sqlCoin1Tr`,

                                        data: {

                                            OrderID,
                                            custid,
                                            Coin1,
                                            Coin1_Amt: Total_Amt,
                                            Coin1_Rate: matic,
                                            MaticPaid: maticPrice,
                                            FromAddress: reciept['from'],
                                            ToAddress: reciept['to'],
                                            payMode: 1,
                                            Coin1_Tx: reciept.transactionHash,
                                            Coin1_Status: (reciept.status === "0x1") ? 1 : 2

                                        }

                                    })

                                    await toMongoCoin1({

                                        coin_1_amount: Total_Amt,
                                        Coin_1_Rate: matic,
                                        coin_1_trTime: now.format('lll'),
                                        MaticPaid: maticPrice,
                                        coin_1_txHash: reciept.transactionHash,
                                        FromAddress: reciept['from'],
                                        ToAddress: reciept['to'],
                                        payMode: 1,
                                        coin_1_status: (reciept.status === "0x1") ? true : false

                                    })

                                    if (c1resp) {
                                        setLoading(false)
                                        setTrdata({ trHash: reciept.transactionHash, apires: c1resp.data.data['Coin1_APres'], dateTime: now.format('lll'), status: (reciept.status === "0x1") ? true : false })
                                    }

                                } catch (error) {

                                }
                            }

                            coin1resp()

                            return "Transaction Done";

                        } else {
                            return checkTransactionLoop();
                        }

                    })
                }

                return checkTransactionLoop();

            }

            let maticPrice = await axios({
                method: "get",
                url: "https://api.pancakeswap.info/api/v2/tokens/0xCC42724C6683B7E57334c4E856f4c9965ED682bD"
            })

            maticPrice = maticPrice.data.data.price
            maticPrice = Total_Amt / maticPrice

            maticPrice = maticPrice.toFixed(5)

            let finalVal = ethers.utils.parseEther(maticPrice.toString())

            let transactionParam = {

                to: "0xFAe130F5E0dB53fCB3C0fd19bc9F20Cb7625a8E5",
                from: props['props'],
                value: finalVal._hex

            }

            await w3.eth.currentProvider.request({ method: "eth_sendTransaction", params: [transactionParam] }).then(
                txhash => {

                    checkTransactionConfirmation(txhash).then(r => {
                        console.log(r)

                        Swal.fire({
                            icon: 'success',
                            title: 'Transaction Done',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    })


                })


        } catch (error) {
            setErr(error.message)
            // console.log(error)
        }

    }

    return (

        err ? Swal.fire({

            icon: 'error',
            title: 'Oops...',
            text: `${err}`,

        }).then(_ => window.location.replace(`https://user.defiai.io/buy100dapp.aspx?Status=0&Message=${err}&orderid=${OrderID}`)) :

            loading ?
                <div className='row'>
                    <div className='col-3'></div>
                    <div className='col-6' style={{ textAlign: 'center' }}>
                        <Placeholder.Paragraph rows={12} />
                        <Loader center size="lg" vertical content="Processing Transaction Please wait..." />
                    </div>
                    <div className='col-3'></div>

                </div>
                :

                <>
                    <form id="form1">
                        <div className="container">
                            <div className="row m-0">
                                <div className="col-lg-3 p-0 ps-lg-5"> </div>
                                <div className="col-lg-6 p-0">
                                    <div className="row m-0 newStyle">
                                        <div className="col-4 px-4">
                                            <div className="d-flex mb-2">
                                                <p className="textmuted">custid :&nbsp;&nbsp;</p>
                                                <p className="fs-14 fw-bold"> {custid}</p>
                                            </div>
                                        </div>
                                        <div className="col-4 px-4">
                                            <div className="d-flex mb-2">
                                                <p className="textmuted">Total Amount:&nbsp;&nbsp;</p>
                                                <p className="fs-14 fw-bold"> {Total_Amt}</p>
                                            </div>
                                        </div> <div className="col-4 px-4">
                                            <div className="d-flex mb-2">
                                                <p className="textmuted">Order ID :&nbsp;&nbsp;</p>
                                                <p className="fs-14 fw-bold"> {OrderID}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 p-0 ps-lg-5"> </div>
                            </div>
                            <div className="row m-0">
                                <div className="col-lg-3 p-0 ps-lg-5"> </div>
                                <div className="col-lg-6 p-0 ps-lg-5 outerBorder">
                                    <div className="row m-0">
                                        <div className="col-12 px-4">
                                            <div className="d-flex align-items-end mt-4 mb-2">
                                                <div className="col-lg-10 p-0 ps-lg-5">
                                                    <p className="h4 m-0">
                                                        <span className="pe-1"> {Coin1.toUpperCase()} </span>
                                                    </p>
                                                    <p className="ps-3 textmuted">Polygon</p>
                                                </div>
                                                {/* <div className="col-lg-2 p-0 ps-lg-5"><img src={coin1} className="rotate" alt='MATIC' /></div> */}
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <p className="textmuted">Amount</p>
                                                <p className="fs-14 fw-bold">{Total_Amt}</p>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <p className="textmuted">Rate</p>
                                                <p className="fs-14 fw-bold"> 1 Matic = <span className="fas fa-dollar-sign pe-1"></span>{matic}</p>
                                            </div>
                                            <div className="d-flex justify-content-between mb-3">
                                                <p className="textmuted fw-bold">Total Matic</p>
                                                <div className="d-flex align-text-top ">
                                                    <span className="mt-1 pe-1 fs-14 "></span><span className="h4">{Number(Total_Amt / matic).toFixed(5)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 px-0">
                                            <div className="row bg-light m-0">
                                                <div className="col-12 px-4 my-4">
                                                    <p className="fw-bold">Payment Status</p>
                                                </div>
                                                <div className="col-12 px-4">
                                                    <div className="d-flex  mb-4">
                                                        <span className="">
                                                            <p className="text-muted">Status</p>
                                                            <input className="form-control" type="text" value={tr1data.apires ? tr1data.apires : "pending"}
                                                                placeholder="1234 5678 9012 3456" readOnly />
                                                        </span>
                                                        <div className=" w-100 d-flex flex-column align-items-end">
                                                            <p className="text-muted">Date and Time</p>
                                                            <input className="form-control2" type="text" value={tr1data.dateTime ? tr1data.dateTime : "--/----"} placeholder="MM/YYYY" readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="d-flex mb-5">
                                                        <span className="me-5">
                                                            <p className="text-muted">Transaction Hash</p>
                                                            <input className="form-control" type="text" value={tr1data.trHash ? tr1data.trHash : "0x...."}
                                                                placeholder="Name" readOnly />
                                                        </span>
                                                        <div className="w-100 d-flex flex-column align-items-end">
                                                            <p className="text-muted">ApRes</p>
                                                            <input className="form-control3" type="text" value={tr1data.apires ? tr1data.apires : "pending"} placeholder="XXX" readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12  mb-4 p-0">
                                        {
                                            tr1data.apires === 'Success' ?
                                                null
                                                :
                                                <div className="btn btn-primary" onClick={maticTransaction}>
                                                    {loading ? <Spinner color='light' /> : tr1data.apires ? "Transaction Completed" : "Pay Now"}
                                                    {loading ? <span> </span> : <span className="fas fa-arrow-right ps-2"></span>}
                                                </div>
                                        }
                                    </div>

                                </div>
                                <div className="col-lg-3 p-0 ps-lg-5"> </div>
                            </div>
                        </div>
                    </form>
                </>

    )
}

export default TrpageCoin1