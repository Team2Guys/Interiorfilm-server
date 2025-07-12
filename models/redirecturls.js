const mongoose = require('mongoose')

const Schema = mongoose.Schema

const redirecturlSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true

    },
    redirectUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
    },


})


const redirectdb = mongoose.model('redirectUrl', redirecturlSchema)

module.exports = redirectdb