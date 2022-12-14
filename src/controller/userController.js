const userTrModel = require("../models/userTrModel");
const { isValid, isValidRequestBody } = require("../utils/helper");
const axios = require("axios");

// Create transaction
const transaction = async (req, res) => {
   try {
      const requestBody = req.body;

      if (!isValidRequestBody(requestBody)) {
         return res
            .status(400)
            .send({ status: false, message: "All fields are mandatory !" });
      }

      //Requestbody Destructure
      const {
         custid,
         Total_Amt,
         OrderID,
         publicAddress,
         Coin_1_Amt,
         Coin_1_Rate,
         coin_1_txHash,
         coin_1_trTime,
         coin_1_status,
         Coin1,
         Pay_Mode,
         FromAddress,
         ToAddress,
         TxDatetime,
      } = requestBody;

      if (!isValid(custid)) {
         return res
            .status(400)
            .send({ status: false, message: "Please Enter custId !" });
      }

      if (!isValid(OrderID)) {
         return res
            .status(400)
            .send({ status: false, message: "Please Enter orderId !" });
      }

      //Validation to check OrderId exists
      const trExist = await userTrModel.findOne({ orderId: OrderID });

      if (trExist) {
         return res
            .status(400)
            .send({ status: false, message: "OrderId Already In Use" });
      }

      //Transaction Data
      let trData = {
         custId: custid,
         total_amt: Total_Amt,
         publicAddress,
         orderId: OrderID,
         Coin1,
         coin_1_amount: Coin_1_Amt,
         Coin_1_Rate,
         coin_1_txHash,
         coin_1_trTime,
         coin_1_status,
         Pay_Mode,
         FromAddress,
         ToAddress,
         TxDatetime,
      };

      //Create document in db
      const transaction = await userTrModel.create(trData);

      //Sending document as a response
      return res
         .status(201)
         .send({ status: true, message: "Success", data: transaction });
   } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
   }
};

//Coin1 transaction update
const coin1Transaction = async (req, res) => {
   try {
      const requestBody = req.body;

      if (!isValidRequestBody(requestBody)) {
         return res
            .status(400)
            .send({ status: false, message: "All fields are mandatory !" });
      }

      //Requestbody Destructure
      const {
         OrderID,
         coin_1_amount,
         Coin_1_Rate,
         coin_1_trTime,
         coin_1_txHash,
         coin_1_status,
         MaticPaid,
         FromAddress,
         ToAddress
      } = requestBody;

      if (!isValid(OrderID)) {
         return res
            .status(400)
            .send({ status: false, message: "Please Enter orderId !" });
      }

      let coin1TrUpdateData = {};

      if ("coin_1_amount" in requestBody) {
         if (!("$set" in coin1TrUpdateData)) {
            coin1TrUpdateData["$set"] = {};
         }
         coin1TrUpdateData["$set"]["coin_1_amount"] = coin_1_amount;
      }

      if ("Coin_1_Rate" in requestBody) {
         if (!("$set" in coin1TrUpdateData)) {
            coin1TrUpdateData["$set"] = {};
         }
         coin1TrUpdateData["$set"]["Coin_1_Rate"] = Coin_1_Rate;
      }

      if ("coin_1_txHash" in requestBody) {
         if (!("$set" in coin1TrUpdateData)) {
            coin1TrUpdateData["$set"] = {};
         }
         coin1TrUpdateData["$set"]["coin_1_txHash"] = coin_1_txHash;
      }

      if ("coin_1_trTime" in requestBody) {
         if (!("$set" in coin1TrUpdateData)) {
            coin1TrUpdateData["$set"] = {};
         }
         coin1TrUpdateData["$set"]["coin_1_trTime"] = coin_1_trTime;
      }

      if ("coin_1_status" in requestBody) {
         if (!("$set" in coin1TrUpdateData)) {
            coin1TrUpdateData["$set"] = {};
         }
         coin1TrUpdateData["$set"]["coin_1_status"] = coin_1_status;
      }

      if ("MaticPaid" in requestBody) {
         if (!("$set" in coin1TrUpdateData)) {
            coin1TrUpdateData["$set"] = {};
         }
         coin1TrUpdateData["$set"]["MaticPaid"] = MaticPaid;
      }

      if ("FromAddress" in requestBody) {
         if (!("$set" in coin1TrUpdateData)) {
            coin1TrUpdateData["$set"] = {};
         }
         coin1TrUpdateData["$set"]["FromAddress"] = FromAddress;
      }

      if ("ToAddress" in requestBody) {
         if (!("$set" in coin1TrUpdateData)) {
            coin1TrUpdateData["$set"] = {};
         }
         coin1TrUpdateData["$set"]["ToAddress"] = ToAddress;
      }

      //Validation to check OrderId exists
      const isCustomerTrExist = await userTrModel.findOne({ orderId: OrderID });

      if (!isCustomerTrExist) {
         return res
            .status(400)
            .send({ status: false, message: "Transaction not exist" });
      }

      if (coin_1_status === true) {
         let coin_1_ApiRes = true;

         if (!("$set" in coin1TrUpdateData)) {
            coin1TrUpdateData["$set"] = {};
         }
         coin1TrUpdateData["$set"]["coin_1_ApiRes"] = coin_1_ApiRes;
      }

      //Update Query
      const updatedTransaction = await userTrModel.findOneAndUpdate(
         { orderId: OrderID },
         coin1TrUpdateData,
         { new: true }
      );

      return res
         .status(200)
         .send({ status: true, message: "Success", data: updatedTransaction });
   } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
   }
};

//Final transaction update
const finalUpdateTransaction = async (req, res) => {
   try {
      const requestBody = req.body;

      if (!isValidRequestBody(requestBody)) {
         return res
            .status(400)
            .send({ status: false, message: "All fields are mandatory !" });
      }

      //Requestbody Destructure
      let { OrderID, final_status } = requestBody;

      if (!isValid(OrderID)) {
         return res
            .status(400)
            .send({ status: false, message: "Please Enter orderId !" });
      }

      const isCustomerTrExist = await userTrModel
         .findOne({ orderId: OrderID })
         .lean();
      if (!isCustomerTrExist) {
         return res
            .status(404)
            .send({ status: false, message: "Transaction not exist" });
      }

      if (!(isCustomerTrExist.coin_1_status == true)) {
         return res.status(400).send({
            status: false,
            message: "Coin1 transaction not Done yet!",
         });
      }

      let trUpdateData = {};

      final_status = true;
      if (!("$set" in trUpdateData)) {
         trUpdateData["$set"] = {};
      }
      trUpdateData["$set"]["final_status"] = final_status;

      let final_ApiRes = true;
      if (!("$set" in trUpdateData)) {
         trUpdateData["$set"] = {};
      }
      trUpdateData["$set"]["final_ApiRes"] = final_ApiRes;

      //Update Query
      const updatedTransaction = await userTrModel.findOneAndUpdate(
         { orderId: OrderID },
         trUpdateData,
         { new: true }
      );

      return res
         .status(200)
         .send({ status: true, message: "Success", data: updatedTransaction });
   } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
   }
};

const BNBLiveRate = async (req, res) => {

   try {

      let rate = await axios.get(

         "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=BNB",

         {
            headers: {
               "X-CMC_PRO_API_KEY": "c7262c86-0874-48e5-8cdf-a69ecc1d3b6c",
            }
         }

      )

      res.json({

         status: true,
         message: "BNB live rate",
         price: rate.data.data.BNB[0].quote.USD.price

      });

   } catch (error) {
      console.log(error)
   }

}

const MaticLiveRate = async (req, res) => {
   try {
      let rate = await axios.get(
         "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=MATIC",
         {
            headers: {
               "X-CMC_PRO_API_KEY": "c7262c86-0874-48e5-8cdf-a69ecc1d3b6c",
            },
         }
      )

      res.json({
         status: true,
         message: "Matic live rate",
         price: rate.data.data.MATIC[0].quote.USD.price,
      })

   } catch (error) {
      res.status(404).send({
         message: 'rate Not Found'
      })
   }
}  

module.exports = {
   transaction,
   coin1Transaction,
   finalUpdateTransaction,
   BNBLiveRate,
   MaticLiveRate
};
