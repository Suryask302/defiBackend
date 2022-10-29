
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import '../assets/Stylesheets/Manual.css'
import providerOptions from '../utils/providerOptions'
// import networks from '../utils/network'
import UsdtBSC from './Networks/BSC/UsdtBSC'
import UsdtPolygon from './Networks/Polygon/UsdtPolygon'
import MaticPolygon from './Networks/Polygon/MaticPolygon';
import TbacPolygon from './Networks/Polygon/TbacPolygon';
import BNBBsc from './Networks/BSC/BNBBsc';
import TbacBep20 from './Networks/BSC/TbacBep20';

import Web3Modal from 'web3modal'
import Swal from 'sweetalert2'
import Web3 from "web3";


let w3

const Transaction = () => {

    const [acc, setAcc] = useState([])
    const [verified, setVerified] = useState(false)
    const [data, setData] = useState({})
    const [err, setError] = useState(null)
    const [isPolygonMatic, setPolygonMatic] = useState(false)
    const [isPolygonTbac, setPolygonTbac] = useState(false)
    const [isPolygonUsdt, setPolygonUsdt] = useState(false)
    const [isBscBnb, setBscBnb] = useState(false)
    const [isBscTbac, setBscTbac] = useState(false)
    const [isBscUsdt, setBscUsdt] = useState(false)

    const [searchParams] = useSearchParams()
    let orderId = searchParams.get('orderid')

    useEffect(() => {
        getAccount()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getAccount = async () => {

        try {

            let web3Modal = new Web3Modal({

                network: "mainnet",
                cacheProvider: true,
                providerOptions

            });

            const web3ModalInstance = await web3Modal.connect()
            const web3ModalProvider = new Web3(web3ModalInstance)
            w3 = web3ModalProvider

            const accounts = await w3.eth.getAccounts()
            if (!accounts || !accounts[0]) {

                setError("unable To Fetch Accounts Please Reload The Page")
                setTimeout(() => {
                    window.location.reload()
                }, 5000)

            }

            setAcc(accounts[0])
            verify()

        } catch (error) {
            setError(error.message)
        }

    }



    async function dumbInDb(data) {

        try {

            let resp = await axios({
                method: 'post',
                url: "https://fifityfifty.herokuapp.com/users",
                data: {
                    publicAddress: acc[0],
                    ...data
                }
            })
            console.log(resp)

        } catch (error) {
            // console.log(error.response.data.message)
        }
    }



    const verify = async () => {

        try {

            if (!orderId) {
                return setError('invalid Order Id')
            }

            let resp = await axios({

                method: 'get',
                url: `https://getway-defi.herokuapp.com/${orderId}/sqlData`

            })

            if (!resp.data.status) {
                setError(resp.data.message)
                console.log(resp)
            }

            console.log(resp.data.data)

            let { re_coinname } = resp.data.data

            console.log(re_coinname)

            if (re_coinname.toUpperCase() === "MATIC(POLYGON)") {
                setPolygonMatic(true)
            }

            if (re_coinname.toUpperCase() === "TBAC(POLYGON)") {
                setPolygonTbac(true)
            }

            if (re_coinname.toUpperCase() === "USDT(POLYGON)") {
                setPolygonUsdt(true)
            }

            if (re_coinname.toUpperCase() === "BNB(BSC)") {
                setBscBnb(true)
            }

            if (re_coinname.toUpperCase() === "TBAC BEP20(BSC)") {
                setBscTbac(true)
            }

            if (re_coinname.toUpperCase() === "USDT(BSC)") {
                setBscUsdt(true)
            }


            setData(resp.data.data)

            if (resp && data) {

                setVerified(true)
                await dumbInDb(resp.data.data)

            }

        } catch (error) {
            console.log(error)
            setError(error.response.data.message)
        }
    }

    return (

        err ? Swal.fire({

            icon: 'error',
            title: 'Error...',
            text: `${err}`,

        }).then(_ => window.location.replace(`https://user.defiai.io/buy100dapp.aspx?Status=0&Message=unable to connect with wallet !&orderid=${orderId}`)) :


            <>
                {
                    verified
                        ?
                        isPolygonTbac ? <TbacPolygon props={acc} data={{ ...data }} we={w3} /> :
                            isPolygonMatic ? <MaticPolygon props={acc} data={{ ...data }} we={w3} /> :
                                isBscBnb ? <BNBBsc props={acc} data={{ ...data }} we={w3} /> :
                                    isBscTbac ? <TbacBep20 props={acc} data={{ ...data }} we={w3} /> :
                                        isBscUsdt ? <UsdtBSC props={acc} data={{ ...data }} we={w3} /> :
                                            isPolygonUsdt ? <UsdtPolygon props={acc} data={{ ...data }} we={w3} /> :
                                                <div> Invalid Combination selected </div>
                        :
                        <div> Mutated Data </div>

                }
            </>

    )
}

export default Transaction





