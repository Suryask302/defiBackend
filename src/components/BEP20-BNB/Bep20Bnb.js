import React, { useEffect, useState } from 'react'
import { bep20Abi, bep20Address } from '../../contracts/BEP20'
import '../../assets/Stylesheets/Trpage.css'
import axios from 'axios'
import { ethers, utils } from 'ethers'
import { Spinner } from 'reactstrap'
import Swal from 'sweetalert2'
import moment from 'moment'
let now = moment()



const Bep20Bnb = (props) => {

    let [tbacC, setTbac] = useState({ oneTbac: 0, allTbac: 0 })
    let [bnb, setBnb] = useState(0)
    let [loading, setLoading] = useState(false)
    let [loading1, setLoading1] = useState(false)
    let [err, setErr] = useState(null)
    let [disAb, setDisAb] = useState(false)
    let [tbacDisabled, settbacDisabled] = useState(false)
    let [bnbDisabled, setbnbDisabled] = useState(false)


    let [tr1data, setTrdata] = useState({
        status: '', trHash: '', apires: '', dateTime: ''
    })

    let [tr2data, setTr2data] = useState({
        status: '', trHash: '', apires: '', dateTime: ''
    })

    let {

        Coin1,
        Coin1_Status,
        Coin1_Tx,
        Coin2,
        Coin2_Rate,
        Coin2_Status,
        Coin2_Tx,
        Coin1_Paid,
        OrderID,
        Coin2_Paid,
        Total_Amt,
        TxDatetime,
        custid,

    } = props.data

    Total_Amt = 0.0005

    if (parseInt(Coin1_Status) === 1) {

        tr1data.apires = 'Success';
        tr1data.trHash = Coin1_Tx;
        tr1data.dateTime = TxDatetime;
        tr1data.status = true;


    }

    if (parseInt(Coin2_Status) === 1) {

        tr2data.apires = 'Success';
        tr2data.trHash = Coin2_Tx;
        tr2data.dateTime = TxDatetime;
        tr2data.status = true;
        tbacC.allTbac = Coin2_Paid
        tbacC.oneTbac = Coin2_Rate

    }


    let w3 = props.we

    useEffect(() => {

        let getRate = async () => {
            setTbac({ oneTbac: 16.00, allTbac: (Total_Amt / 2) / 16 })
            setBnb(270.00)
        }
        getRate()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    async function toMongoCoin2(params) {

        try {

            await axios({

                method: 'put',
                url: "https://fifityfifty.herokuapp.com/coin2Tr",
                data: {
                    OrderID,
                    ...params
                }

            })

        } catch (error) {

        }
    }

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

            setDisAb(true)
            let dotNet = await axios({
                method: 'put',
                url: `https://fifityfifty.herokuapp.com/sqlFinalTr`,

                data: {
                    OrderID,
                    custid: custid,
                    payMode: 2,
                    Final_Status: (tr1data.status && tr2data.status) ? 1 : 2
                }

            })

            if (dotNet.data.status === true) {
                localStorage.clear()
                window.location.replace(`https://user.defiai.io/buy5050dapp.aspx?Status=1&Message=Successfully Purchased&orderid=${OrderID}`)
            }

            await axios({
                method: 'put',
                url: 'https://fifityfifty.herokuapp.com/update',
                data: {
                    OrderID: OrderID,
                    payMode: 2,
                    final_status: (tr1data.status && tr2data.status) ? true : false
                }
            })

        } catch (error) {

        }
    }


    async function TbacTransaction() {

        try {

            setLoading(true)
            settbacDisabled(true)

            let tbac = (Total_Amt / 2) / 16
            console.log(tbac)
            tbac = tbac * 10000000000000000
            tbac = tbac / 10000000000000000
            tbac = tbac.toFixed(5)
            let amt = utils.parseUnits(tbac.toString(), 8)
            console.log(amt)

            if (tbac) {

                let bep20 = new w3.eth.Contract(bep20Abi, bep20Address)

                let balance = await bep20.methods.balanceOf(props['props']).call()
                balance = balance / 100000000

                if (tbac >= balance) {
                    return setErr('insufficient TBAC Balance')
                }

                await bep20.methods.transfer('0xFAe130F5E0dB53fCB3C0fd19bc9F20Cb7625a8E5', amt._hex).send({
                    from: props['props'],
                    gas: 150000,
                    gasPrice: w3.utils.toWei('54.05', 'gwei')

                }).then(reciept => {
                    console.log(reciept)

                    async function coin2resp() {

                        try {

                            let c2resp = await axios({
                                method: 'put',
                                url: `https://fifityfifty.herokuapp.com/sqlCoin2Tr`,

                                data: {

                                    OrderID,
                                    custid: custid,
                                    Coin2,
                                    Coin2_Amt: Total_Amt / 2,
                                    Coin2_Rate: tbacC.oneTbac,
                                    Coin2_Paid: reciept['amount'],
                                    FromAddress: reciept['from'],
                                    ToAddress: reciept['to'],
                                    Coin2_Tx: reciept.transactionHash,
                                    Coin2_Status: reciept.status === true ? 1 : 2,

                                }

                            })

                            await toMongoCoin2({

                                coin_2_amount: Total_Amt / 2,
                                Coin_2_Rate: tbacC.oneTbac,
                                coin_2_trTime: now.format('lll'),
                                coin_2_txHash: reciept.transactionHash,
                                Coin2_Paid: reciept['amount'],
                                FromAddress: reciept['sender'],
                                ToAddress: reciept['receiver'],
                                coin_2_status: (reciept.status === true) ? true : false

                            })

                            if (c2resp) {
                                setLoading(false)
                                setTr2data({ trHash: reciept.transactionHash, apires: c2resp.data.data['Coin2_APres'], dateTime: now.format('lll'), status: (reciept.status === true) ? true : false })
                                Swal.fire({

                                    icon: 'success',
                                    title: 'Transaction Done',
                                    showConfirmButton: false,
                                    timer: 2000

                                })
                            }

                        } catch (error) {
              
                        }
                    }

                    coin2resp()

                }).catch(e => setErr(e.message))

            }

        } catch (error) {

        }

    }

    async function bnbTransaction() {

        try {

            setLoading1(true)
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

                                    let c1resp = await axios({
                                        method: 'put',
                                        url: `https://fifityfifty.herokuapp.com/sqlCoin1Tr`,

                                        data: {

                                            OrderID,
                                            custid,
                                            Coin1,
                                            Coin1_Amt: Total_Amt / 2,
                                            Coin1_Rate: bnb,
                                            Coin1_Paid: bnbPrice,
                                            FromAddress: bnbTrReport['from'],
                                            ToAddress: bnbTrReport['to'],
                                            payMode: 2,
                                            Coin1_Tx: reciept.transactionHash,
                                            Coin1_Status: (reciept.status === "0x1") ? 1 : 2

                                        }

                                    })

                                    await toMongoCoin1({

                                        coin_1_amount: Total_Amt / 2,
                                        Coin_1_Rate: bnb,
                                        coin_1_trTime: now.format('lll'),
                                        Coin1_Paid: bnbPrice,
                                        coin_1_txHash: reciept.transactionHash,
                                        FromAddress: bnbTrReport['from'],
                                        ToAddress: bnbTrReport['to'],
                                        payMode: 2,
                                        coin_1_status: (reciept.status === "0x1") ? true : false

                                    })

                                    if (c1resp) {
                                        setLoading1(false)
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

            let bnbPrice
            bnbPrice = 270.00
            bnbPrice = (Total_Amt / 2) / bnbPrice
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

        }).then(_ => window.location.replace(`https://user.defiai.io/buy5050dapp.aspx?Status=0&Message=${err}&orderid=${OrderID}`)) :

            <>
                <form id="form1">
                    <div className="container">
                        <div className="row m-0">
                            <div className="col-lg-12 p-0">
                                <div className="row m-0 newStyle">
                                    <div className="col-4 px-4">
                                        <div className="d-flex mb-2">
                                            <p className="textmuted colorHead">custid :&nbsp;&nbsp;</p>
                                            <p className="fs-14 fw-bold"> {custid}</p>
                                        </div>
                                    </div>
                                    <div className="col-4 px-4">
                                        <div className="d-flex mb-2">
                                            <p className="textmuted colorHead">Total Amount:&nbsp;&nbsp;</p>
                                            <p className="fs-14 fw-bold"> {Total_Amt}</p>
                                        </div>
                                    </div> <div className="col-4 px-4">
                                        <div className="d-flex mb-2">
                                            <p className="textmuted colorHead">Order ID :&nbsp;&nbsp;</p>
                                            <p className="fs-14 fw-bold"> {OrderID}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row m-0 outerBorder">


                            {/* Coin 2 Tr Started */}

                            <div className="col-lg-6 p-0 ps-lg-5">
                                <div className="row m-0">
                                    <div className="col-12 px-4">
                                        <div className="d-flex align-items-end mt-4 mb-2">
                                            <div className="col-lg-10 p-0 ps-lg-5">
                                                <p className="h4 m-0">
                                                    <span className="pe-1"> {Coin2.toUpperCase() + " BEP20"} </span>
                                                </p>
                                                <p className="ps-3 textmuted"> BSC </p></div>
                                            {/* <div className="col-lg-2 p-0 ps-lg-5"><img src="" className="rotate" alt='TBAC' /></div> */}
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <p className="textmuted">Amount</p>
                                            <p className="fs-14 fw-bold">{Total_Amt / 2}</p>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <p className="textmuted">rate</p>
                                            <p className="fs-14 fw-bold"> 1 TBAC = <span className="fas fa-dollar-sign pe-1"></span>{Number(tbacC.oneTbac).toFixed(5)}</p>
                                        </div>

                                        <div className="d-flex justify-content-between mb-3">
                                            <p className="textmuted fw-bold">Total TBAC</p>
                                            <div className="d-flex align-text-top ">
                                                <span className="mt-1 pe-1 fs-14 "></span><span className="h4">{Number(tbacC.allTbac).toFixed(5)}</span>
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
                                                        <input className="form-control" type="text" value={tr2data.apires ? tr2data.apires : "pending"}
                                                            placeholder="1234 5678 9012 3456" readOnly />
                                                    </span>
                                                    <div className=" w-100 d-flex flex-column align-items-end">
                                                        <p className="text-muted">Date and Time</p>
                                                        <input className="form-control2" type="text" value={tr2data.dateTime ? tr2data.dateTime : "--/----"} placeholder="MM/YYYY" readOnly />
                                                    </div>
                                                </div>
                                                <div className="d-flex mb-5">
                                                    <span className="me-5">
                                                        <p className="text-muted">Transaction Hash</p>
                                                        <input className="form-control" type="text" value={tr2data.trHash ? tr2data.trHash : "0x...."}
                                                            placeholder="Name" readOnly />
                                                    </span>
                                                    <div className="w-100 d-flex flex-column align-items-end">
                                                        <p className="text-muted">ApRes</p>
                                                        <input className="form-control3" type="text" value={tr2data.apires ? tr2data.apires : "Pending"} placeholder="XXX" readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row m-0">
                                            <div className="col-12  mb-4 p-0">

                                                {

                                                    tr2data.apires === 'Success' ?
                                                        <button disabled={true} className="btn btn-primary"> Transaction Completed </button>
                                                        :
                                                        <button disabled={tbacDisabled} className="btn btn-primary" onClick={TbacTransaction}>
                                                            {loading ? <Spinner color='light' /> : tr2data.apires ? "Transaction Completed" : "Pay Now"}
                                                            {loading ? <span> </span> : <span className="fas fa-arrow-right ps-2"></span>}
                                                        </button>

                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 p-0 ps-lg-5">
                                <div className="row m-0">
                                    <div className="col-12 px-4">
                                        <div className="d-flex align-items-end mt-4 mb-2">
                                            <div className="col-lg-10 p-0 ps-lg-5">
                                                <p className="h4 m-0">
                                                    <span className="pe-1"> {Coin1.toUpperCase()} </span>
                                                </p>
                                                <p className="ps-3 textmuted">BSC</p>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <p className="textmuted">Amount</p>
                                            <p className="fs-14 fw-bold">{Total_Amt / 2}</p>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <p className="textmuted">Rate</p>
                                            <p className="fs-14 fw-bold"> 1 BNB = <span className="fas fa-dollar-sign pe-1"></span>{bnb}</p>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3">
                                            <p className="textmuted fw-bold">Total BNB</p>
                                            <div className="d-flex align-text-top ">
                                                <span className="mt-1 pe-1 fs-14 "></span><span className="h4">{!Coin1_Paid ? Number((Total_Amt / 2) / bnb).toFixed(5) : Coin1_Paid}</span>
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
                                        <div className="row m-0">
                                            <div className="col-12  mb-4 p-0">

                                                {

                                                    tr1data.apires === 'Success' ?

                                                        <button disabled={true} className="btn btn-primary"> Transaction Completed </button> :

                                                        <button disabled={bnbDisabled} className="btn btn-primary" onClick={bnbTransaction}>
                                                            {loading1 ? <Spinner color='light' /> : tr1data.apires ? "Transaction Completed" : "Pay Now"}
                                                            {loading1 ? <span> </span> : <span className="fas fa-arrow-right ps-2"></span>}
                                                        </button>

                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="col-lg-12 p-0 ps-lg-5">
                                <div className="row m-0">
                                    <div className="col-12  mb-4 p-0">

                                        {
                                            (tr1data.status && tr2data.status) ? <button disabled={disAb} className="btn btn-primary stackBtn" onClick={finalUpdate}>
                                                {(tr1data.status && tr2data.status) ? `Stake Now -$ ${Total_Amt}` : null}<span className="fas fa-arrow-right ps-2"></span>
                                            </button> : ""
                                        }

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            </>

    )
}

export default Bep20Bnb