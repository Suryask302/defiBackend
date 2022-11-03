import axios from 'axios'
import React, { useState } from 'react'
import moment from 'moment'
import '../../assets/Stylesheets/Manual.css'
import Swal from 'sweetalert2'
import { Loader, Placeholder } from 'rsuite';
let now = moment()


const VerifyHash = (props) => {

    let [thash, setThash] = useState(null)
    let [verified, setVerified] = useState(null)
    let [err, setErr] = useState(null)
    let [loading, setLoading] = useState(null)

    let [data, setData] = useState({
        receiver: null, txHash: null, value: null, coinPaid: null,
    })


    let {

        or_orderid,
        or_curr_amt,
        re_usd_rate,
        re_usd_Amt

    } = props['props']['data']

    const verifyTxHash = async () => {

        try {

            let verification

            if (!thash) {
                return alert('please Enter a Valid Transaction Hash')
            }

            setLoading(true)
            if (
                props.coinName.toLowerCase() === `USDT(Polygon)`.toLowerCase() ||
                props.coinName.toLowerCase() === `MATIC(Polygon)`.toLowerCase() ||
                props.coinName.toLowerCase() === `BlockAura 2.0(Polygon)`.toLowerCase() ||
                props.coinName.toLowerCase() === `BlockAura 3.0(Polygon)`.toLowerCase()
            ) {
                verification = await axios({
                    method: 'post',
                    url: 'https://getway-defi.herokuapp.com/verifyAllTr',
                    data: {
                        txHash: thash
                    }
                })

            } else {

                verification = await axios({
                    method: 'post',
                    url: 'https://getway-defi.herokuapp.com/verifyBinanceNetTr',
                    data: {
                        txHash: thash
                    }
                })
            }

            if (!verification['data']['data']) {
                return alert('Invalid Transaction Hash Enterd')
            }

            const { Amount, Receiver, Token, Sender } = verification['data']['data']

            const rateCompare = (Amount * re_usd_rate)

            // console.log(rateCompare)
            // console.log(or_curr_amt)

            // console.log(Amount, Receiver, Token, Sender)


            if (props['props']['props'].toLowerCase().trim() !== Sender.toLowerCase().trim()) {
                return setErr(`Sender Address mismatched`)
            }

            if (Number(Amount).toFixed(5) !== Number(re_usd_Amt).toFixed(5)) {
                return setErr(`amount mismatched`)
            }

            if (Receiver.toLowerCase() !== '0xFAe130F5E0dB53fCB3C0fd19bc9F20Cb7625a8E5'.toLowerCase()) {
                return setErr(`reciever Address mismatched`)
            }

            if (!props.coinName.toLowerCase().startsWith(Token.toLowerCase())) {
                return setErr(`coin Mismatched`)
            }


            let updateStatus = await axios({

                method: 'Post',
                url: `https://getway-defi.herokuapp.com/defiPay/api/v1`,

                data: {

                    order_id: or_orderid,
                    payment_status: 'confirmed',
                    pay_currency: props.coinName,
                    pay_amount: or_curr_amt,
                    actually_paid: Amount,
                    pay_address: thash,
                    updated_at: now.format('lll'),
                    Coin_Rate: re_usd_rate

                }

            })

            if (updateStatus.data.data.trim().toLowerCase() === 'success') {

                setVerified(true)
                setData({
                    txHash: thash, receiver: Receiver, value: rateCompare.toFixed(5), coinPaid: Amount
                })

                Swal.fire({

                    icon: 'success',
                    title: 'Transaction Done',
                    showConfirmButton: false,
                    timer: 2000

                })

                setTimeout(() => {
                    window.location.replace(`https://user.defiai.io/wallet.aspx?Status=1&Message=Successfully Deposited&orderid=${or_orderid}`)
                }, 5000)

            } else {
                setErr('Transaction Hash Already Verified |OR| data of this transaction is not found !')
            }

        } catch (error) {
            setErr(error['message'])
        }

    }

    const setTx = (e) => {
        e.preventDefault()
        setThash(e.target.value)
    }

    return (

        err ? Swal.fire({

            icon: 'error',
            title: 'Error',
            text: `${err}`,

        }).then(_ => window.location.replace(`https://user.defiai.io/wallet.aspx?Status=0&Message=${err}&orderid=${or_orderid}`)) :

            loading ?
                <div className='row'>
                    <div className='col-3'>

                    </div>
                    <div className='col-6' style={{ textAlign: 'center' }}>
                        <Placeholder.Paragraph rows={12} />
                        <Loader center size="lg" vertical content="Processing Transaction Please wait..." />
                    </div>
                    <div className='col-3'>

                    </div>
                </div> :

                <>
                    <div className='col-md-6 mx-auto mt-6'>
                        <div style={{
                            border: "2px solid black",
                            padding: "20px",
                            borderRadius: "7px",
                            marginTop: "10px"
                        }}>

                            <form>
                                <div className='col-md-12'>
                                    <label htmlFor="fname">Enter Transaction Hash - {props.coinName}</label>
                                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                        <input className='formInput' type="text" placeholder={`${props.coinName}  tx hash`} onChange={setTx} />&nbsp;&nbsp;
                                        <div className='btn btn-success' style={{ height: '41px' }} onClick={verifyTxHash}> Check </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div >

                    {
                        verified ?
                            <div className='col-md-6 mx-auto mt-6'>
                                <div style={{
                                    border: "2px solid black",
                                    padding: "20px",
                                    borderRadius: "7px",
                                    marginTop: "10px"
                                }}>
                                    <div className='row'>
                                        <div className='col-md-6' style={{ marginTop: '10px' }}>
                                            <div className='formInput'>
                                                <b style={{ marginTop: "5px" }}>Reciever</b><br></br>
                                                {data['receiver']}
                                            </div>
                                        </div>
                                        
                                        <div className='col-md-6' style={{ marginTop: '10px' }}>
                                            <div className='formInput'>
                                                <b style={{ marginTop: "5px" }}>coinPaid</b><br></br>
                                                {data.coinPaid}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-md-6' style={{ marginTop: '10px' }}>
                                            <div className='formInput'>
                                                <b style={{ marginTop: "5px" }}>Amount</b><br></br>
                                                $  {data['value']}
                                            </div>
                                        </div>
                                        <div className='col-md-4' style={{ marginTop: '10px' }}>
                                            <div className='formInput' >
                                                <b style={{ marginTop: "5px" }}>Hash</b><br></br>
                                                <p style={{ overflow: 'scroll' }}>  {data['txHash']} </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> :
                            null
                    }

                </>
    )

}

export default VerifyHash