const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')

const connectDB = async () => {
    try{
        await mongoose.set('strictQuery', false)
        await mongoose.connect(db)
        console.log('database connected...')
    }catch(err){
        console.error(err.message)
        process.exit(1) // Exit process with failure status
    }
}

module.exports = connectDB