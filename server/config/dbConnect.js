const mongoose = require('mongoose')
const connectdb =  async(DATABASE_URL) => {
    try{
        const DB_OPTIONS = {
           dbName:process.env.DB_NAME
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
        console.log('db connected successfully')
    } catch(error) {
        console.log(error)
    }
}
module.exports= connectdb
