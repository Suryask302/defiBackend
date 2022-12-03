const sql = require("mssql")
const { isValidRequestBody, isValid } = require("../utils/helper")
const sqlDb = require("../utils/sqlServer")

const request = new sql.Request()
const axios = require("axios")

const getSqlServerData = async (req, res) => {

	try {

		let OrderId = req.params.or_orderid;
		OrderId = OrderId.trim();
		if (!isValid(OrderId)) {
			return res
				.status(400)
				.send({ status: false, message: "OrderId is Mandatory !" });
		}

		let fullQuery =
			"select * from Crypto_Gateway_Detail where or_orderid =" + OrderId;

	
		const resData = await request.query(fullQuery);
		if (!resData.recordsets[0][0]) {
			return res
				.status(404)
				.send({ status: false, message: "Data not found !" });
		}

		return res.status(200).send({
			status: true,
			message: "Success",
			data: resData.recordsets[0][0],
		})

	} catch (error) {
		return res.status(500).send({ status: false, message: error.message });
	}
}

const verifyTbacTR = async (req, res) => {

	try {
		let { transactionHash } = req.body

		const options = {
			method: "POST",
			data: { hash: transactionHash },
			url: `http://139.59.69.218:3390/api/dappReact`,
		}

		let response = await axios(options)
		data = response.data;

		return res.status(200).send({
			data,
		})

	} catch (error) {
		return res.status(500).send({
			message: `unable to process your request`,
		})
	}

}

const sqlBackendApi = async (req, res) => {
	try {

		const requestBody = req.body;
		if (!isValidRequestBody(requestBody)) {
			return res
				.status(400)
				.send({ status: false, message: "All fields are mandatory !" })
		}
		let {
			order_id,
			payment_status,
			pay_currency,
			pay_amount,
			actually_paid,
			pay_address,
			purchase_id,
			payment_id,
			updated_at,
			Coin_Rate,
		} = requestBody;

		purchase_id = 0
		payment_id = 0

		let updateStatus = await axios({
			method: "Post",
			url: `https://user.defiai.io/selfgateway.ashx`,
			data: {
				order_id,
				payment_status,
				pay_currency,
				pay_amount,
				actually_paid,
				pay_address,
				purchase_id,
				payment_id,
				updated_at,
				Coin_Rate,
			},
		})
		// console.log(updateStatus)

		return res.status(200).send({
			status: true,
			message: "Success",
			data: updateStatus.data,
		})

	} catch (error) {
		return res.status(500).send({
			message: error.message,
		})
	}
};


const firstUpdate = async (req, res) => {

	try {

		let OrderId = req.params.orderId;

		if (!OrderId) {
			return res.status(400).send({
				status: false, message: "OrderId is Mandatory !"
			})
		}

		let re_usd_rate = req.body.rate
		let re_usd_Amt = req.body.usdAmt
		let query = `Update Crypto_Gateway_Detail set re_usd_rate=${re_usd_rate},re_usd_Amt=${re_usd_Amt} where or_orderid= + ${OrderId}`

		const resData = await request.query(query)

		console.log(resData)

		if (resData.rowsAffected[0] === 1) {

			return res.status(200).send({
				status: true,
				message: "Success",
			});


		}
		return res
			.status(404)
			.send({ status: false, message: "Data not Updated !" });



	} catch (error) {
		return res.status(500).send({
			message: error.message,
		})
	}
}

const verifyAllTransactions = async (req, res) => {

	try {

		let txHash = req.body.txHash

		if (!txHash) {
			return res.status(400).send({
				message: `Please enter Transaction Hash`
			})
		}

		let result = await axios({
			method: 'post',
			url: `http://139.59.69.218:3390/api/transactionPolygon`,
			data: {
				hash: txHash
			}
		})

		return res.status(200).send({
			message: 'Success',
			data: result.data.data
		})


	} catch (error) {

		return res.status(500).send({
			message: error['message']
		})

	}
}


const verifyBinanceTransactions = async (req, res) => {

	try {

		let txHash = req.body.txHash
		if (!txHash) {
			return res.status(400).send({
				message: `Please enter Transaction Hash`
			})
		}


		let result = await axios({
			method: 'post',
			url: `http://139.59.69.218:3390/api/transactionBsc`,
			data: {
				hash: txHash
			}
		})

		return res.status(200).send({
			message: 'Success',
			data: result.data.data
		})

	} catch (error) {
		return res.status(500).send({
			message: error['message']
		})
	}
}

module.exports = {

	getSqlServerData,
	verifyTbacTR,
	sqlBackendApi,
	firstUpdate,
	verifyAllTransactions,
	verifyBinanceTransactions

}
