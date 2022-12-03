
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
import BlockAura2 from './Networks/Polygon/BlockAura2.0'
import Manual from './manualTr/Manual'
// import BlockauraErc20 from './Networks/Ethereum/BlockauraErc20'


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
    const [isBlockaura2, setBlockaura2] = useState(false)
    const [ismanual, setIsmanual] = useState(false)

    // const [isBlockauraErc20, setBlockauraErc20] = useState(false)



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



    // async function dumbInDb(data) {

    //     try {

    //         await axios({
    //             method: 'post',
    //             url: "https://fifityfifty.herokuapp.com/users",
    //             data: {
    //                 publicAddress: acc[0],
    //                 ...data
    //             }
    //         })

    //     } catch (error) {
    //         // console.log(error.response.data.message)
    //     }
    // }



    const verify = async () => {

        try {

            let manual = searchParams.get('manual')
            if (manual === 'true') setIsmanual(true)

            let orderId = searchParams.get('orderid')

            if (!orderId) {
                return setError('invalid Order Id')
            }

            let resp = await axios({

                method: 'get',
                url: `https://defiai.onrender.com/96096581/sqlData`

            })

            console.log(resp)
            
            if (!resp.data.status) {
                setError(resp.data.message)
            }

            console.log(resp.data.data)

            let { re_coinname } = resp.data.data

            if (re_coinname.toUpperCase() === "Matic(Polygon)".toLocaleUpperCase()) {
                setPolygonMatic(true)
            }

            if (re_coinname.toUpperCase() === "BlockAura 3.0(Polygon)".toLocaleUpperCase()) {
                setPolygonTbac(true)
            }

            if (re_coinname.toUpperCase() === "USDT(Polygon)".toLocaleUpperCase()) {
                setPolygonUsdt(true)
            }

            if (re_coinname.toUpperCase() === "BNB(BEP 20)".toLocaleUpperCase()) {
                setBscBnb(true)
            }

            if (re_coinname.toUpperCase() === "BlockAura(BEP20)".toLocaleUpperCase()) {
                setBscTbac(true)
            }

            if (re_coinname.toUpperCase() === "BUSD(BEP20)".toLocaleUpperCase()) {
                setBscUsdt(true)
            }

            if (re_coinname.toUpperCase() === "BlockAura 2.0(Polygon)".toLocaleUpperCase()) {
                setBlockaura2(true)
            }

            // if (re_coinname.toUpperCase() === "BlockAura 3.0(Erc20)".toLocaleUpperCase()) {
            //     setBlockauraErc20(true)
            // }


            setData(resp.data.data)

            if (resp && data) {
                setVerified(true)
                // await dumbInDb(resp.data.data)

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

        }).then(_ => window.location.replace(`https://user.defiai.io/wallet.aspx?Status=0&Message=unable to connect with wallet !&orderid=${orderId}`)) :


            <>
                {
                    verified
                        ?
                        ismanual ? <Manual props={acc} data={{ ...data }} we={w3} /> :
                            isPolygonTbac ? <TbacPolygon props={acc} data={{ ...data }} we={w3} /> :
                                isPolygonMatic ? <MaticPolygon props={acc} data={{ ...data }} we={w3} /> :
                                    isBscBnb ? <BNBBsc props={acc} data={{ ...data }} we={w3} /> :
                                        isBscTbac ? <TbacBep20 props={acc} data={{ ...data }} we={w3} /> :
                                            isBscUsdt ? <UsdtBSC props={acc} data={{ ...data }} we={w3} /> :
                                                isPolygonUsdt ? <UsdtPolygon props={acc} data={{ ...data }} we={w3} /> :
                                                    isBlockaura2 ? <BlockAura2 props={acc} data={{ ...data }} we={w3} /> :
                                                        // isBlockauraErc20 ? <BlockauraErc20 props={acc} data={{ ...data }} we={w3} /> :

                                                        <div> Invalid Combination selected </div>
                        :
                        <div> Verification is in Process, Please Wait... </div>

                }
            </>

    )
}

export default Transaction





