const express = require("express")
const dotenv = require("dotenv")
const app = express()
const contentPassRoutes = require("./routes/contentPassRoutes.js")
const hostName = require("./utils/constant")
const cors = require('cors')
dotenv.config({ path: '.env' });
require('./db');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/Api/dailyPass',contentPassRoutes)
app.get('/', (req, res) => {
    res.send('hello world');
  });

app.listen(process.env.PORT || 8082,()=>{
    console.log("server start")
})