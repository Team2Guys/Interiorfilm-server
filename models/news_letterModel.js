const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const news_letterSchema = new Schema({
    email:{
        type:String,
        required: true,
        unique: true 
    }
})



const new_letter_db = mongoose.model("new_letter_user", news_letterSchema)



module.exports = new_letter_db
