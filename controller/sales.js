const Sale = require('../models/salesModel.js');
const mongoose = require('mongoose');


const Productdb = require('../models/productModel.js');
const { sendEmailHandler } = require('../utils/emailHandler.js')

const axios = require('axios');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

const uniqueId = uuidv4();

function generateUniqueString() {
  return `id_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}
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
    const response = await paymobAPI.post('/auth/tokens', { api_key: apiKey });
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
    const { token, amount, } = req.body;
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
  const { token, orderId, shipmentFee, products, subtotalAmount, totalAmount, date, ...extractedData } = req.body;
  try {
    let sale = await Sale.findOne({ usermail: extractedData.email });

    const parsedDate = date ? new Date(date) : undefined;
    console.log('orderId', orderId, typeof (orderId));

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

    // const saleProducts = await Promise.all(products.map(async (item) => {

    //   let product = await Productdb.findOne({ name: item.name })
    //   if (!product) {
    //     console.log("Issue idr hai bhai")
    //     throw new Error(`Product with ID ${item.products} not found`);

    //   }
    //   return {
    //     id: product._id,
    //     name: item.name,
    //     price: item.price,
    //     discountPrice: item.discountPrice,
    //     colorName: item.colorName,
    //     count: item.count,
    //     totalPrice: item.totalPrice,
    //     purchasePrice: item.purchasePrice,
    //     date: item.date ? item.date : Date.now(),
    //     shippment_Fee: shipmentFee,
    //     order_id: orderId,
    //     paymentStatus: false,
    //     checkout: true,
    //     length: item.length,
    //     imageUrl: item.imageUrl

    //   };

    // }));

    if (sale) {
      sale.products = sale.products.concat(products);
      sale.date = parsedDate ? parsedDate : Date.now()
      sales.shipmentFee = shipmentFee
    } else {
      sale = new Sale({
        usermail: extractedData.email,
        userAddress: extractedData.address,
        country: extractedData.country,
        city: extractedData.city,
        phone_number: extractedData.phone_number,
        products,
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



    return res.status(201).json({ paymentKey: paymentKeyResponse.data.token });
  } catch (error) {

    console.log(error.message, "error")
    return res.status(500).json({ message: error });
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
      merchant_order_id,
      length
    } = req.body
    // if (!id || !success || !amount_cents || !integration_id || !currency || !order_id || !pending || !is_3d_secure || !created_at) {
    //     return res.status(400).json({ message: 'Missing required fields in request body' });
    // }
    let successFlag = success.toLowerCase() === "true"

    if (!successFlag) return res.status(404).json({ message: 'Payment not successfull' });

    const saleRecord = await Sale.findOne({ "products": { $elemMatch: { order_id: order_id } } });
    console.log(saleRecord.paymentStatus, "saleRecord",
    )
    if (!saleRecord) throw new Error('Product not found');


    let filteredProduct = saleRecord.products.filter((item) => item.order_id == order_id);


    
    if (filteredProduct.length === 0) throw new Error('Product not found');

      if (filteredProduct?.[0].paymentStatus) {
      return res.status(400).json({ message: 'Duplicate order detected' });
    }
    let TotalPrice = 0;
    let shippment_Fee = "";

    console.log(filteredProduct, "product length")

    for (const orderRecord of filteredProduct) {
      const { id, Count, color } = orderRecord;

      let product = await Productdb.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      product.totalStockQuantity -= orderRecord.length;

      TotalPrice += Number(orderRecord.totalPrice);
      shippment_Fee = orderRecord.shippment_Fee

      await product.save();

    }

    saleRecord.products = saleRecord.products.map((item) => { return ({ ...item, checkout: false, is_3d_secure: is_3d_secure, transction_Date: Date.now(), paymentStatus: true, is_refund: is_refund, currency: currency, transactionId: id, pending: pending }) })
    await saleRecord.save()
    // sendEmailHandler(saleRecord.first_name + " " + saleRecord.last_name, saleRecord.phone_number, saleRecord.userAddress, `${saleRecord.city}, ${saleRecord.country}`, orderRecord.totalPrice, saleRecord.products, orderRecord.shippment_Fee, ' Order has been confirmed')
    function formatDate(isoDateString) {
      const date = new Date(isoDateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    }
    const purchaseDate = formatDate(saleRecord.date);
    sendEmailHandler((saleRecord.first_name + " " + saleRecord.last_name), saleRecord.usermail, saleRecord.phone_number, saleRecord.userAddress, `${saleRecord.city}, ${saleRecord.country}`, TotalPrice, filteredProduct, shippment_Fee, `New Order confirmed against Order #${order_id}`, null, purchaseDate, order_id)
    sendEmailHandler((saleRecord.first_name + " " + saleRecord.last_name), saleRecord.usermail, saleRecord.phone_number, saleRecord.userAddress, `${saleRecord.city}, ${saleRecord.country}`, TotalPrice, filteredProduct, shippment_Fee, `Order has been confirmed against Order # ${order_id}`, saleRecord.usermail, purchaseDate, order_id)

    const { products, ...without } = saleRecord

    console.log(filteredProduct, "filteredProduct")
    return res.send(filteredProduct)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error', error: err });
  }
};

exports.proceedPayment = async (req, res) => {
  try {
    const { data, amount, shipmentFee } = req.body;
    const { productItems, totalAmount, subtotalAmount, ...billing_data } = data;

    let order_id = generateUniqueString(); // Ensure uniqueness
    const parsedDate = new Date();

    let sale = await Sale.findOne({ usermail: billing_data.email, "products.order_id": { $exists: false } });

    const headers = {
      "Authorization": `Token ${process.env.PAYMOB_SECRET_KEY}`,
      "Content-Type": "application/json"
    };

    const staticProduct = {
      name: 'Shipping Fee',
      amount: shipmentFee === 'Free' || typeof shipmentFee === 'undefined' ? 0 : shipmentFee * 100,
    };

    const products = productItems.map(product => ({
      ...product,
      amount: product.totalPrice * 100,
    }));

    const updatedProducts = [...products, staticProduct];

    const requestBody = JSON.stringify({
      "amount": amount * 100,
      "currency": process.env.PAYMOD_CURRENCY,
      "payment_methods": [158, 49727, 52742, 52741, 52992, 53201],
      "items": updatedProducts,
      "billing_data": billing_data,
      "special_reference": order_id,
      "redirection_url": "https://interiorfilm.ae/thankyou"
    });

    // ✅ Await fetch() to prevent race conditions
    const response = await fetch("https://uae.paymob.com/v1/intention/", {
      method: 'POST',
      headers: headers,
      body: requestBody,
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const result = await response.json();
    console.log(result.intention_order_id, "intention_order_id");

    // ✅ Prevent duplicate orders
    const existingSale = await Sale.findOne({ "products.order_id": result.intention_order_id });
    if (existingSale) {
      return res.status(400).json({ message: 'Duplicate order detected' });
    }

    const items = productItems.map(product => ({
      ...product,
      order_id: result.intention_order_id,
      shippment_Fee: shipmentFee === 'Free' || typeof shipmentFee === 'undefined' ? 0 : shipmentFee
    }));

    if (sale) {
      sale.products = sale.products.concat(items);
      sale.date = parsedDate;
    } else {
      sale = new Sale({
        usermail: billing_data.email,
        userAddress: billing_data.address,
        country: billing_data.country,
        city: billing_data.city,
        phone_number: billing_data.phone_code + billing_data.phone_number,
        products: items,
        date: parsedDate,
        first_name: billing_data.first_name,
        last_name: billing_data.last_name,
      });
    }

    await sale.save();

    return res.status(201).json({ message: 'Order has been created successfully', data: result });

  } catch (error) {
    console.log("error from catch", error);
    res.status(500).json({ message: error.message || 'Internal server error', error });
  }
};


