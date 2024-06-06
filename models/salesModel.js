const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    usermail: {
        type: String,
        required: String
    },
    userAddress: {
        type: String
    },
    products: [{
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        price: Number,
        discountPrice: Number,
        colorName: String,
        count: Number,
        totalPrice: Number,
        purchasePrice:Number
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
