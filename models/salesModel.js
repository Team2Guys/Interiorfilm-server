const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({
    usermail: {
        type: String,
        required: String
    },
    
    first_name: {
        type: String
    },
    
    last_name: {
        type: String
    },
    
    userAddress: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    phone_number: {
        type: String
    },
    products: [{
        id: {
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
        purchasePrice: Number,
        date: {
            type: Date,
            default: Date.now
        },
        imageUrl: {
            type: String,
            required: true
        
          },
        shippment_Fee:String,
        order_id:{
            type: String,
            default: false
        },
        checkout:{
            type: Boolean,
            required: true,
            default: false
        },
        paymentStatus: {
            type: Boolean,
            required: true,
            default: false
        },
        is_refund: {
            type: Boolean,
            default: false
    
        },
        currency: {
            type: String,
    
        },
        transactionId: {
            type: String,
    
        },
        integration_id: {
            type: String,
    
        },
        amount_cents: {
            type: String,
    
        },
        success: {
            type: Boolean,
            default: false
    
        },
        pending: {
            type: Boolean,
            default: false
    
        },
        is_3d_secure: {
            type: Boolean,
    
        },
        createdAt: {
            type: Date,
            default: Date.now,
            },
            length: {
            type: Number,
            },
    
        


    }],
    date: {
        type: Date,
        default: Date.now
    },




});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
