
import React, { useEffect, useState } from 'react'
import '../../../assets/Stylesheets/Trpage.css'
import axios from 'axios'
import { ethers } from 'ethers'
import { Spinner } from 'reactstrap'
import { Loader, Placeholder } from 'rsuite';
import Swal from 'sweetalert2'
import moment from 'moment'
let now = moment()



const BNBBsc = (props) => {

    let [bnb, setBnb] = useState(0)
    let [loading, setLoading] = useState(false)
    let [err, setErr] = useState(null)
    let [bnbDisabled, setbnbDisabled] = useState(false)

    let [transData, setTransData] = useState({
        status: '', trHash: '', apires: '', dateTime: ''
    })

    let {

        or_orderid,
        or_custid,
        or_curr_amt

    } = props.data

    useEffect(() => {

        (async function () {

            let chainId = await w3.eth.getChainId()
            if (chainId !== 56) {
                return setErr('Please Connect To Binance Smart Chain')
            }

        })();

        const getRate = async () => {

            let rate = await axios({
                method: 'get',
                url: 'https://onlymatic.herokuapp.com/getBNBRate'
            })

            setBnb(rate.data.price.toFixed(5))
        }

        getRate()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let w3 = props.we


    async function bnbTransaction() {

        try {

            setLoading(true)
            setbnbDisabled(true)

            function checkTransactionConfirmation(txhash) {

                const checkTransactionLoop = () => {
                    return w3.eth.currentProvider.request({ method: "eth_getTransactionReceipt", params: [txhash] }).then(async reciept => {

                        if (reciept !== null) {

                            async function getReport() {
                                let report = await w3.eth.getTransaction(txhash)
                                return report
                            }

                            let bnbTrReport = await getReport()

                            if (bnbTrReport) {

                                if (Number(bnbTrReport['value'] / 1000000000000000000) !== Number(bnbPrice)) {
                                    return setErr('mutation in transaction Amount ..!')
                                }

                                if (bnbTrReport['to'].toLowerCase() !== '0xFAe130F5E0dB53fCB3C0fd19bc9F20Cb7625a8E5'.toLowerCase()) {
                                    return setErr('mutation in Address..!')
                                }

                            }

                            async function coin1resp() {

                                try {

                                    console.log('called')
                                    let updateStatus = await axios({

                                        method: 'Post',
                                        url: `https://getway-defi.herokuapp.com/defiPay/api/v1`,

                                        data: {

                                            order_id: or_orderid,
                                            payment_status: 'confirmed',
                                            pay_currency: 'BNB(Bsc)',
                                            pay_amount: or_curr_amt,
                                            actually_paid: Number(bnbPrice),
                                            pay_address: reciept.transactionHash,
                                            updated_at: now.format('lll'),
                                            Coin_Rate: bnb


                                        }

                                    })

                                    console.log(updateStatus)

                                    if (updateStatus) {
                                        setLoading(false)
                                        setTransData({ trHash: reciept.transactionHash, apires: 'Success', dateTime: now.format('lll'), status: (reciept.status === "0x1" || reciept.status === true) ? true : false })

                                    }

                                } catch (error) {
                                    console.log(error)
                                }
                            }

                            await coin1resp()
                            return "Transaction Done";

                        } else {
                            return checkTransactionLoop();
                        }

                    })
                }

                return checkTransactionLoop();

            }

            let bnbPrice
            bnbPrice = bnb
            bnbPrice = or_curr_amt / bnbPrice
            bnbPrice = bnbPrice.toFixed(5)
            console.log(bnbPrice)
            let finalVal = ethers.utils.parseEther(bnbPrice.toString())

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

                        setTimeout(() => {
                            window.location.replace(`https://user.defiai.io/wallet.aspx?Status=1&Message=Successfully Purchased&orderid=${or_orderid}`)

                        }, 5000)

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

        }).then(_ => window.location.replace(`https://user.defiai.io/wallet.aspx?Status=0&Message=${err}&orderid=${or_orderid}`)) :

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
                                                <p className="fs-14 fw-bold"> {or_custid}</p>
                                            </div>
                                        </div>
                                        <div className="col-4 px-4">
                                            <div className="d-flex mb-2">
                                                <p className="textmuted">Total Amount:&nbsp;&nbsp;</p>
                                                <p className="fs-14 fw-bold"> {or_curr_amt}</p>
                                            </div>
                                        </div> <div className="col-4 px-4">
                                            <div className="d-flex mb-2">
                                                <p className="textmuted">Order ID :&nbsp;&nbsp;</p>
                                                <p className="fs-14 fw-bold"> {or_orderid}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>


                            <div className="row m-0">
                                <div className="col-lg-3 p-0 ps-lg-5"> </div>
                                <div className="col-lg-6 p-0 ps-lg-5" style={{ borderLeft: "2px solid", borderRight: "2px solid", borderBottom: "2px solid" }}>
                                    <div className="row m-0 ">                                      
                                            <div className="col-12 px-4">
                                                <div className="d-flex align-items-end mt-4 mb-2">
                                                    <div className="col-lg-10 p-0 ps-lg-5">
                                                        <p className="h4 m-0">
                                                            <span className="pe-1"> BNB </span>
                                                        </p>
                                                        <p className="ps-3 textmuted">Bsc</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <p className="textmuted">Amount</p>
                                                    <p className="fs-14 fw-bold">{or_curr_amt}</p>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <p className="textmuted">Rate</p>
                                                    <p className="fs-14 fw-bold"> 1 BNB = <span className="fas fa-dollar-sign pe-1"></span>{bnb}</p>
                                                </div>
                                                <div className="d-flex justify-content-between mb-3">
                                                    <p className="textmuted fw-bold">Total BNB</p>
                                                    <div className="d-flex align-text-top ">
                                                        <span className="mt-1 pe-1 fs-14 "></span><span className="h4">{Number((or_curr_amt) / bnb).toFixed(5)}</span>
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
                                                                <input className="form-control" type="text" value={transData.apires ? transData.apires : "pending"}
                                                                    placeholder="1234 5678 9012 3456" readOnly />
                                                            </span>
                                                            <div className=" w-100 d-flex flex-column align-items-end">
                                                                <p className="text-muted">Date and Time</p>
                                                                <input className="form-control2" type="text" value={transData.dateTime ? transData.dateTime : "--/----"} placeholder="MM/YYYY" readOnly />
                                                            </div>
                                                        </div>
                                                        <div className="d-flex mb-5">
                                                            <span className="me-5">
                                                                <p className="text-muted">Transaction Hash</p>
                                                                <input className="form-control" type="text" value={transData.trHash ? transData.trHash : "0x...."}
                                                                    placeholder="Name" readOnly />
                                                            </span>
                                                            <div className="w-100 d-flex flex-column align-items-end">
                                                                <p className="text-muted">ApRes</p>
                                                                <input className="form-control3" type="text" value={transData.apires ? transData.apires : "pending"} placeholder="XXX" readOnly />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row m-0">
                                                    <div className="col-12  mb-4 p-0">

                                                        {

                                                            transData.apires === 'Success' ?

                                                                <button disabled={true} className="btn btn-primary"> Transaction Completed </button> :

                                                                <button disabled={bnbDisabled} className="btn btn-primary" onClick={bnbTransaction}>
                                                                    {loading ? <Spinner color='light' /> : transData.apires ? "Transaction Completed" : "Pay Now"}
                                                                    {loading ? <span> </span> : <span className="fas fa-arrow-right ps-2"></span>}
                                                                </button>

                                                        }

                                                    </div>
                                                </div>
                                            </div>                                      
                                    </div>
                                </div>
                                <div className="col-lg-3 p-0 ps-lg-5"> </div>
                            </div>





                        </div>
                    </form>
                </>
    )
}

export default BNBBsc