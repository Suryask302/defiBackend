const mongoose = require("mongoose");

const userTrModel = new mongoose.Schema(
  {
    or_gateway: {
      type: String,
      // required: true,
    },
    or_orderid: {
      type: String,
      unique: true,
    },
    or_custid: {
      type: Number,
      required: true,
    },
    or_curr_amt: {
      type: Number,
    },
    or_timestamp: {
      type: String,
    },
    re_status: {
      type: Boolean,
      default: false,
    },
    re_order2: {
      type: String,
    },
    re_user_identifier: {
      type: String,
    },
    re_usercountry: {
      type: String,
    },
    re_curr_amt: {
      type: Number,
    },
    re_currency: {
      type: String,
    },
    re_tx: {
      type: String,
    },
    re_datetime: {
      type: String,
    },
    re_confirm: {
      type: String,
    },
    re_coinname: {
      type: String,
    },
    remark: {
      type: String,
    },
    wallettxno: {
      type: String,
    },
    re_orderID: {
      type: Number,
    },
    re_usd_rate: {
      type: Number,
    },
    re_usd_Amt: {
      type: Number,
    },
    re_pay_address: {
      type: String,
    },
    re_purchase_id: {
      type: String,
    },
    coinget: {
      type: String,
    },
    marketid: {
      type: Number,
    },
    total_amt: {
      type: Number,
    },
    Pay_Mode: {
      type: Number,
    },

    Coin1: {
      type: String,
    },

    coin_1_amount: {
      type: Number,
    },

    coin_1_txHash: {
      type: String,
    },
    coin_1_trTime: {
      type: String,
    },

    Coin_1_Rate: {
      type: Number,
    },

    coin_1_status: {
      type: Boolean,
      default: false,
    },

    final_status: {
      type: Boolean,
      default: false,
    },

    TxDatetime: {
      type: String,
    },

    coin_1_ApiRes: {
      type: Boolean,
      default: false,
    },

    final_ApiRes: {
      type: Boolean,
      default: false,
    },

    MaticPaid: {
      type: String,
      default: 0,
    },

    FromAddress: {
      type: String,
    },

    ToAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserTransaction", userTrModel);
