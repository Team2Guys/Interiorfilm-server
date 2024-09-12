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
            console.log("API Key is not set in environment variables.");
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
      console.log('extractedData', extractedData);
      
      const paymentKeyResponse = await paymobAPI.post('/acceptance/payment_keys', {
        auth_token: token,
        amount_cents: (totalAmount) * 100,
        expiration: 3600,
        order_id: orderId,
        billing_data: extractedData,
        currency: process.env.PAYMOD_CURRENCY,
        integration_id: process.env.PAYMOB_INTEGRATION_ID,

    });

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
          paymentStatus:false
  
        };

      }));
  
      if (sale) {
        console.log(saleProducts, "sales")

        sale.products = sale.products.concat(saleProducts);
        sale.date = parsedDate ? parsedDate : Date.now()
      } else {
        console.log(saleProducts, "saleProducts", "sales")
  
        sale = new Sale({
          usermail:extractedData.email,
          userAddress:extractedData.address,
          products: saleProducts,
          date: parsedDate
        });
      }
  
      await sale.save();
  
      return res.status(201).json({paymentKey: paymentKeyResponse.data.token });
    } catch (error) {
  
      console.log(error.message, "error")
      return res.status(500).json({ message: error});
    }
  };



  exports.postPayhnalder = async (req, res) => {
    try {
        const { id,
            success,
            amount_cents,
            integration_id,
            currency,
            is_refund,
            order_id,
            pending,
            is_3d_secure,
            created_at
        } = req.body
        if (!id || !success || !amount_cents || !integration_id || !currency || !order_id || !pending || !is_3d_secure || !created_at) {
            return res.status(400).json({ message: 'Missing required fields in request body' });
        }

        let orderRecord = await PaymentDB.findOne({ order_id });

        if (!orderRecord) {
            return res.status(404).json({ message: 'Payment record not found' });
        }
        orderRecord.paymentStatus = success
        orderRecord.success = success
        orderRecord.amount_cents = amount_cents
        orderRecord.integration_id = integration_id
        orderRecord.currency = currency
        orderRecord.is_refund = is_refund
        orderRecord.is_3d_secure = is_3d_secure
        orderRecord.transactionDate = created_at
        orderRecord.transactionId = id
        orderRecord.pending = pending
        orderRecord.checkout = false
        let TotalProductsPrice = 0

        function formatProductDetails(products) {
            return products.map(product => {
                TotalProductsPrice += Number(product.totalPrice)
                return `Product: ${product.name}\nColor: ${product.color}\nCount: ${product.Count}\nTotal Price:${product.totalPrice}`;
            }).join('\n');
        }
        formatProductDetails(orderRecord.orderedProductDetails)
        const updateProductQuantity = async (orderedProductDetails) => {

            for (const orderedProduct of orderedProductDetails) {
                const { id, Count, color } = orderedProduct;

                // Find the product by ID
                let product = await Productdb.findById(id);
                if (!product) {
                    return res.status(404).json({ message: "Product not found" });
                }

                // Update the total stock quantity
                product.totalStockQuantity -= Count;

                // Update the variant stock quantity
                let variant = product.variantStockQuantities.find(v => v.variant === color);
                if (variant) {
                    variant.quantity -= Count;
                }

                // Save the updated product
                await product.save();
        
            }

        }



  let successFlag= success.toLowerCase()==="true"

        if (successFlag) {
            sendEmailHandler(orderRecord.first_name + " " + orderRecord.last_name, orderRecord.email, orderRecord.phone_number, orderRecord.address, `${orderRecord.state}, ${orderRecord.country}`, TotalProductsPrice, orderRecord.orderedProductDetails, orderRecord.shippment_Fee, ' Order has been confirmed')
            sendEmailHandler(orderRecord.first_name + " " + orderRecord.last_name, orderRecord.email, orderRecord.phone_number, orderRecord.address,  `${orderRecord.state}, ${orderRecord.country}`, TotalProductsPrice, orderRecord.orderedProductDetails, orderRecord.shippment_Fee, ' Order has been confirmed', orderRecord.email)
            await orderRecord.save();
            await updateProductQuantity(orderRecord.orderedProductDetails)
            return res.status(200).json({ message: 'Payment record updated successfully' })
        } else {
            throw new Error("Payement not successfull")
        }

    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal server error', error: err });
    }
};

  