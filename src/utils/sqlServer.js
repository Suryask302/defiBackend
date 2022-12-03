const sql = require("mssql");

// config for your database
var config = {
  user: "wow_dbonlyreader_defidb",
  password: "wow_dbonlyreader_defidb",
  server: "69.28.92.43",
  database: "wps_defiaiwow_db",
  synchronize: true,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
}

// connect to your database
let sqlDb = sql
  .connect(config)
  .then((_) => console.log("Connected to SqlServer !"))
  .catch((err) => console.log(err));

module.exports = { sqlDb }
