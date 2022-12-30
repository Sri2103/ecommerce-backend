
require("dotenv").config()
const connectDB = require("./DB/db")
const http = require('http');
const app = require("./app/app")
const server = http.createServer(app)
connectDB()
server.listen(5000, () => {console.log('Server listening on port ' + 5000)})
process.on("unhandledRejection", err =>{
  console.log(`An error occured: ${err.message}`)
  server.close(() =>process.exit(1))
})

