const Sale = require('../models/salesModel.js');
const mongoose = require('mongoose');



const Productdb = require('../models/productModel.js');
const { sendEmailHandler } = require('../utils/emailHandler')

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const paymobAPI = axios.create({
    baseURL: process.env.PAYMOD_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

  const gentereateToken = async () => {
    try {
        const apiKey = process.env.PAYMOB_API_KEY;
        if (!apiKey) {
            console.log("API Key is not set in environment variables.", apiKey);
            throw new Error("API Key is not set in environment variables.")
        }
        const response = await paymobAPI.post('/auth/tokens', {api_key: apiKey});
        // console.log("Authentication response: ", response.data);
        const token = response.data.token;
        return token;
    } catch (err) {
        throw new Error(err.message || JSON.stringify(err))
    }
}

exports.authenticate = async (req, res) => {

    try {
        let token = await gentereateToken()
        res.status(200).json({ token });
    } catch (error) {
        // console.log("ERROR during authentication");
        // console.log(error.response ? error.response.data : error.message); // Detailed error logging
        res.status(500).json({ error: error.message });
    }
};


exports.createOrder = async (req, res) => {
    console.log("Reached Order creation");
    try {
        const { token, amount,  } = req.body;
        console.log(token, amount)
        const orderResponse = await paymobAPI.post('/ecommerce/orders', {
            auth_token: token,
            delivery_needed: false,
            amount_cents: amount * 100,
            currency: process.env.PAYMOD_CURRENCY,
            merchant_id: process.env.PAYMOB_MERCHANT_ID,
        });
        const orderId = orderResponse.data.id;
        console.log("Order Id");
        console.log(orderId);
        res.status(200).json({ orderId });
    } catch (error) {

        res.status(500).json({ error: error.message });
    }
};



exports.recordSale = async (req, res) => {
    const { token, orderId,shipmentFee, products,subtotalAmount, totalAmount, date, ...extractedData } = req.body;
    try {
     let sale=  await Sale.findOne({ usermail : extractedData.email });
  
      const parsedDate = date ? new Date(date) : undefined;
      console.log('orderId',orderId, typeof(orderId));
      
      const paymentKeyResponse = await paymobAPI.post('/acceptance/payment_keys', {
        auth_token: token,
        amount_cents: (totalAmount) * 100,
        expiration: 3600,
        order_id: orderId,
        billing_data: extractedData,
        currency: process.env.PAYMOD_CURRENCY,
        integration_id: process.env.PAYMOB_INTEGRATION_ID,

    });
    console.log(paymentKeyResponse, "paymentKeyResponse")

      const saleProducts = await Promise.all(products.map(async (item) => {
  
  let product= await Productdb.findOne({ name:item.name})
        if (!product) {
          throw new Error(`Product with ID ${item.products} not found`);
  
        }
        return {
          id: product._id,
          name: item.name,
          price: item.price,
          discountPrice: item.discountPrice,
          colorName: item.colorName,
          count: item.count,
          totalPrice: item.totalPrice,
          purchasePrice: item.purchasePrice,
          date: item.date ? item.date : Date.now(),
          shippment_Fee:shipmentFee,
          order_id: orderId,
          paymentStatus:false,
          checkout: true,
          length:item.length,
          imageUrl: item.imageUrl
          
        };

      }));
  
      if (sale) {
        sale.products = sale.products.concat(saleProducts);
        sale.date = parsedDate ? parsedDate : Date.now()
      } else {
        console.log(saleProducts, "saleProducts", "sales")
  
        sale = new Sale({
          usermail:extractedData.email,
          userAddress:extractedData.address,
          country:extractedData.country,
          city:extractedData.city,
          phone_number:extractedData.phone_number,
          products: saleProducts,
          date: parsedDate,
          first_name: extractedData.first_name,
          last_name: extractedData.last_name
        });
      }
  
      await sale.save();
  


        // const response = await axios.post('https://pakistan.paymob.com/api/acceptance/payment_keys', {
        //   auth_token: token,
        //   amount_cents: totalAmount * 100, // amount in cents
        //   expiration: 3600, // token expiration time in seconds
        //   order_id: orderId,
        //   billing_data: {
        //     first_name: 'Muhammad',
        //     last_name: 'Faad',
        //     country: 'Pakistan',
        //     phone_number: '923184036661',
        //     email: 'faadsardar123@gmail.com',
        //     address: 'Islamabasdfasfsadfasdfasfasdffadsfad',
        //     state: 'punjab',
        //     city: 'Islamabad',
        //     street: 'Main Boulevard',
        //     floor: '2',
        //     building: "-",
        //     apartment:"-",
        //     shipping_method: 'Courier',
        //   },
        //   currency: "PKR",
        //       integration_id: 174077,
      
        // });


        // return response.data;

      

      return res.status(201).json({paymentKey: paymentKeyResponse.data.token });
    } catch (error) {
  
      console.log(error.message, "error")
      return res.status(500).json({ message: error});
    }
  };




  exports.postPayement = async (req, res) => {
    try {
        const { 
            id,
            success,
            amount_cents,
            integration_id,
            currency,
            is_refund,
            order_id,
            pending,
            is_3d_secure,
            created_at,
            length
        } = req.body
        // if (!id || !success || !amount_cents || !integration_id || !currency || !order_id || !pending || !is_3d_secure || !created_at) {
        //     return res.status(400).json({ message: 'Missing required fields in request body' });
        // }
  let successFlag= success.toLowerCase()==="true"

if(!successFlag) return res.status(404).json({ message: 'Payment not successfull' });

      const updateResult = await Sale.updateOne(
        { "products.order_id": order_id },
        { 
            $set: {
                "products.$.paymentStatus": success,
                "products.$.success": success,
                "products.$.amount_cents": amount_cents,
                "products.$.integration_id": integration_id,
                "products.$.currency": currency,
                "products.$.is_refund": is_refund,
                "products.$.is_3d_secure": is_3d_secure,
                "products.$.transactionDate": created_at,
                "products.$.transactionId": id,
                "products.$.pending": pending,
                "products.$.checkout": false
            }
        }
    );
    

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: 'Payment record not found' });
  }

    const saleRecord = await Sale.findOne(
      { "products": { $elemMatch: { order_id: order_id } } }
    );
  
  if(!saleRecord)throw new Error('Product not found');

  let filteredProduct=  saleRecord.products.filter((item)=>item.order_id ==order_id)
  if(!(filteredProduct.length > 0))throw new Error('Product not found');
let TotalPrice= ''
let shippment_Fee =""

  for (const orderRecord of filteredProduct) {
    const { id, Count, color } = orderRecord;

    let product = await Productdb.findById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
console.log(typeof(orderRecord.length), "totalStockQuantity")
    product.totalStockQuantity -= orderRecord.length;
    
    TotalPrice = orderRecord.totalPrice
    shippment_Fee= orderRecord.shippment_Fee
    // let variant = product.variantStockQuantities.find(v => v.variant === color);
    // if (variant) {
    //     variant.quantity -= length;
    // }

    
  
    await product.save();

}


console.log(TotalPrice, "shippment_Fee", shippment_Fee)

  // sendEmailHandler(saleRecord.first_name + " " + saleRecord.last_name, saleRecord.usermail, saleRecord.phone_number, saleRecord.userAddress, `${saleRecord.city}, ${saleRecord.country}`, orderRecord.totalPrice, saleRecord.products, orderRecord.shippment_Fee, ' Order has been confirmed')
  sendEmailHandler((saleRecord.first_name + " " + saleRecord.last_name), saleRecord.usermail, saleRecord.phone_number, saleRecord.userAddress,  `${saleRecord.city}, ${saleRecord.country}`, TotalPrice, saleRecord.products, shippment_Fee, ' Order has been confirmed', saleRecord.usermail)
    
const {products, ...without} =saleRecord

console.log(without._doc, "saleRecord")



return res.send(filteredProduct)
    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal server error', error: err });
    }
};

  