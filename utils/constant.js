const dotenv = require("dotenv")
dotenv.config({ path: '.env' });
const userHostName  = process.env.ENVIRONMENT === "DEVELOPMENT" ?  "http://localhost:8080" :  process.env.USERHOSTNAME 
const seriesHostName  = process.env.ENVIRONMENT === "DEVELOPMENT" ?  "http://localhost:8081":  process.env.SERIESHOSTNAME 
const hostName = {userHostName , seriesHostName}
module.exports =  hostName