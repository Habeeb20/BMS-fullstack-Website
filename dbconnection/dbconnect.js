const mongoose = require('mongoose');

const connectdb = async() => {
    try {
        const connect = await mongoose.connect("mongodb+srv://Habeeb:Ademola1234@habeeb.pal57xa.mongodb.net/Authentication?retryWrites=true&w=majority")
        console.log("congrats, your database is successfully connected")
        
    } catch (error) {
        console.log(error)
        
    }
}


module.exports = connectdb