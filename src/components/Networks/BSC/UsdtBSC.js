import React, { useState } from 'react'
import '../assets/Stylesheets/Trpage.css'
import axios from 'axios'
import { usdtBscAbi, usdtBscAddr } from '../../../contracts/usdtBsc'
import { utils } from 'ethers'
import { Spinner } from 'reactstrap'
import { Loader, Placeholder } from 'rsuite';
import Swal from 'sweetalert2'

import moment from 'moment'
let now = moment()


const UsdtBSC = () => {

    





    async function usdtBscTra() {

        try {

            setLoading(true)
            settbacDisabled(true)

            let tbac = Total_Amt / 16
            tbac = tbac * 10000000000000000
            tbac = tbac / 10000000000000000
            tbac = tbac.toFixed(5)
            let amt = utils.parseUnits(tbac.toString(), 8)
            console.log(amt)

            if (tbac) {

                let bep20 = new w3.eth.Contract(usdtBscAbi, usdtBscAddr)

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
                                    Coin2_Amt: Total_Amt,
                                    Coin2_Rate: tbacC.oneTbac,
                                    Coin2_Paid: reciept['amount'],
                                    FromAddress: reciept['from'],
                                    ToAddress: reciept['to'],
                                    Coin2_Tx: reciept.transactionHash,
                                    Coin2_Status: reciept.status === true ? 1 : 2,

                                }

                            })

                            await toMongoCoin2({

                                coin_2_amount: Total_Amt,
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
                                setTransData({ trHash: reciept.transactionHash, apires: c2resp.data.data['Coin2_APres'], dateTime: now.format('lll'), status: (reciept.status === true) ? true : false })
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



    return (



    )
}

export default UsdtBSC