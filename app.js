const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000
const db = require('./server/config/dbConnect.js');
const db_url = process.env.DB_URL
const userRoutes = require('./server/routes/userRoutes')
app.use(cors())
app.use(express.json())
app.use('/api',userRoutes)
db(db_url)
app.get('/',(req,res) =>{
    res.send('express work')
})
app.listen(port,()=>{
    console.log(`you are listen at ${port}`)
})
