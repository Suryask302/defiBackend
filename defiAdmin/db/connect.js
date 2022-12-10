
/*                                          connecting MongoDb                                        */

require('dotenv').config()
const { connect, connection } = require('mongoose')

connect(process.env.DBURI, { useNewUrlParser: true })
    .then(() => console.log(`defi admin Mongo-DB Connected`))
    .catch((err) => console.log(err))

connection.on(`connected`, _ => {
    console.log(`mongoose Connected To DB`)
})

connection.on(`error`, err => {
    console.log(err.message)
})

connection.on(`disconnected`, _ => {
    console.log(`mongoose Connection Is Disconnected`)
})

process.on(`SIGINT`, async _ => {
    await connection.close()
    process.exit(0)
}) 