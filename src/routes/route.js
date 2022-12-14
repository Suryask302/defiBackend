

const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")
const sqlDb = require("../controller/sqlServerController")
const apiPool = require('../apiPool/verifyTr')

//MongoDB Server Api's
router.post("/users", userController.transaction)
router.put("/coin1Tr", userController.coin1Transaction)
router.put("/update", userController.finalUpdateTransaction)

//SQL(.NET) Server Api's
router.get("/:or_orderid/sqlData", sqlDb.getSqlServerData)
router.post("/verifyTbacTR", sqlDb.verifyTbacTR)
router.post("/defiPay/api/v1", sqlDb.sqlBackendApi)

//Verify TBAC Transaction
router.get("/getBNBRate", userController.BNBLiveRate)
router.get("/getMaticRate", userController.MaticLiveRate)
router.put('/firstUpdate/:orderId', sqlDb.firstUpdate)
router.post('/verifyAllTr', sqlDb.verifyAllTransactions)
router.post('/verifyBinanceNetTr', sqlDb.verifyBinanceTransactions)
router.get('/globalVerify', apiPool.globalVerify).get('/getTbacRate', apiPool['getBlockauraRate'])
    .post('/getRate/api/v1', apiPool['getCalculatedRates'])
    .get('/allCoinRates', apiPool.sendAllCoinRates)
module.exports = router;
