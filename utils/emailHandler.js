const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path')

const transporter = nodemailer.createTransport({
   host: 'mail.blindsandcurtains.ae',
   port: 587,
   secure: false,
   auth: {
      user: `${process.env.ADMIN_MAIL}`,
      pass: `${process.env.ADMIN_PASSWORD}`,
   },
});

const sendEmailHandler = async (name, email, phone, address, State, TotalProductsPrice, productDetails, shippment_Fee, subject, CustomerEmail, purchaseDate, orderId) => {
   console.log("name", TotalProductsPrice);

   const mailOptions = {
      //   from:process.env.MAILER_MAIL,
      from: `"Order Confirmation" <${process.env.MAILER_MAIL}>`,
      to: CustomerEmail ? CustomerEmail : `${process.env.CONTACTUS_MAIL1},${process.env.CONTACTUS_MAIL2},${process.env.CONTACTUS_MAIL3},${process.env.CONTACTUS_MAIL4}`,
      subject: subject ? subject : 'Order Confirmation',
      html: `<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Order Confirmation</title>
   <style>
      body {
         font-family: Arial, sans-serif;
         margin: 0;
         padding: 0;
         background-color: #f4f4f4;
      }

      .container {
         max-width: 500px;
         margin: 20px auto;
         background-color: #fff;
         box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
         border-top: 5px solid #FB7320;
         border-bottom: 5px solid #FB7320;
      }

      .main-container {
         padding: 20px;
         background-color:rgb(255, 255, 255) !important;
      }

      .header {
         text-align: center;
         padding: 20px 0;
      }

      .header img {
         max-width: 250px;
      }

      .status {
         display: flex;
         justify-content: center;
         align-items: center;
         margin: 20px 0;
      }

      .status div {
         padding: 10px 20px;
         border-radius: 20px;
         margin: 0 5px;
         display: flex;
         align-items: center;
         justify-content: center;
         width: 120px;
         font-weight: bold;
      }

      .confirmed {
         background-color: #FB7320;
         color: #fff;
      }

      .shipping,
      .received {
         background-color: #ddd;
         color: #333;
      }

      .order-button {
         display: block;
         width: 200px;
         text-align: center;
         background-color: #FB7320;
         color: white !important;
         padding: 10px;
         margin: 20px auto;
         text-decoration: none;
         border-radius: 1px;
      }

      .table-font{
         font-size: 13px;
         color: black;
      }
        
      .order-para{
        color: black;
      }
      
      .purchase-details {
         background-color: #FFF9F5;
         padding: 15px;
         margin-top: 20px;
      }

      .purchase-table {
         width: 100%;
         border-collapse: collapse;
         text-align: center;
      }

      .purchase-table th,
      .purchase-table td {
         padding: 10px;
         text-align: left;
         border-bottom: 1px solid #ddd;
      }

      .footer {
         background-color: #FB7320;
         color: white;
         text-align: center;
         padding: 15px 0;
         margin-top: 20px;
      }

      .social-icons {
         text-align: center;
         margin-top: 10px;
      }

      .social-icons a {
         margin: 0 10px;
         text-decoration: none;
         font-size: 18px;
         color: #333;
      }

      .features {
         background-color: #ff6600;
         color: white;
         padding: 20px;
         display: flex;
         justify-content: space-around;
      }

      .feature {
         text-align: center;
      }

      .feature img {
         width: 40px;
         height: 40px;
      }

      .social-icons {
         padding: 15px;
      }

      .social-icons a {
         margin: 0 10px;
         text-decoration: none;
         font-size: 20px;
         color: black;
      }

      .features {
         background-color: #ff6600;
         color: white;
         width: 100%;
         align-items: center;
         padding: 30px;
      }

      .feature {
         text-align: center;
      }

      .feature img {
         width: 30px;
         height: auto;
      }

      .categories {
         margin-top: 5px;
         padding: 15px 0px;
         border-top: 2px solid #ccc;
         border-bottom: 2px solid #ccc;
         text-align: center;
      }

      .categories a {
         font-size: 11px;
         font-weight: 100;
         margin-top: 5px;
         text-decoration: none;
         color: rgb(255, 255, 255);
         padding: 10px 15px;
         background-color: #FB7320;
         display: inline-block;
      }

      .social-icons {
         padding: 15px;
      }

      .social-icons a {
         margin: 0 10px;
         text-decoration: none;
         font-size: 20px;
         color: black;
      }

      .progress-container {
         align-items: center;
         justify-content: center;
         margin-top: 50px;
         margin-bottom: 50px;
         width: 100%;
      }

      .step {
         display: flex;
         flex-direction: column;
         align-items: center;
         position: relative;
      }

      .step:not(:last-child)::after {
         content: "";
         position: absolute;
         width: 80px;
         height: 2px;
         background-color: black;
         top: 25px;
         left: 100%;
         transform: translateX(-40%);
      }

      .icon {
         width: 50px;
         height: 50px;
         border-radius: 50%;
         display: flex;
         align-items: center;
         justify-content: center;
         background-color: white;
         border: 2px solid black;
         font-size: 24px;
      }

      .completed .icon {
         background-color: #ff6600;
         color: white;
         border: none;
      }

      .step p {
         margin-top: 8px;
         font-size: 14px;
         font-weight: bold;
      }

  @media (max-width: 450px) {
         .main-container{
            padding: 20px 5px;
         }
         .purchase-details{
            padding: 15px 5px;
         }
         .table-font.user-info{
            padding: 0px !important;
         }
         .user-info-wrapper{
            padding-right: 5px !important;
         }
         .total-wrapper{
            padding-right: 5px !important;
            padding-left: 5px !important;
         }
      }
      @media (max-width: 400px) {
         .table-font{
            font-size: 11px;
         }
         .purchase-details{
            padding: 15px 5px;
         }
      }
      @media (max-width: 350px) {
         .main-container{
            padding: 20px 5px;
         }
         .purchase-details{
            padding: 15px 5px;
         }
         .table-font{
            font-size: 10px;
         }
         .product-title-wrapper{
            width: 170px !important;
         }
         .product-title-wrapper .table-font {
            margin-left: 0px !important;
         }
         .purchase-details h3 {
            font-size: 16px !important;
         }
         .order-para {
            font-size: 14px !important;
         }
          .product-title-wrapper .product-img {
            width: 60px !important;
            height: 60px !important;
         }
        .categories a {
         padding: 10px;
        }
      }
   </style>
</head>

<body>
   <div class="container">
      <div class="main-container">
         <div class="header" style="text-align:center;">
            <img
               src="https://res.cloudinary.com/dqvywckz8/image/upload/v1740575139/Frame_1321315836_z0ujlv.jpg"
               alt="Brand Logo">
         </div>
         <h3 style="text-align:center; margin:0; padding:0; color: black;">ORDER#${orderId}</h3>
         <p style="text-align:center;margin:0;padding:0; color: black;">${purchaseDate}</p>
         <h1 style="text-align:center; color: black;">Order Confirmed</h1>

         <div class="progress-container" style="text-align:center;">
            <img src="https://res.cloudinary.com/dqvywckz8/image/upload/v1740566764/Frame_1321315821_gtaltq.jpg"
               alt="Progress Status" style="width: 100%;">
         </div>
         <p style="text-align:center;" class="order-para">Dear <b>Customer,</b></p>
         <p style="text-align:center;" class="order-para">Thank you very much for the order <br> you placed with <a
               href="https://interiorfilm.ae/">www.interiorfilm.ae</a></p>
         <a href="#" class="order-button">View Your Order</a>
         <p style="text-align:center;" class="order-para">Your order has now been sent to the warehouse to prepare for packing and
            dispatch.</p>
         <p style="text-align:center;" class="order-para">Our team will be in touch soon to arrange the delivery with you.</p>
         <p style="text-align:center;" class="order-para">All The Best,</p>
         <p style="text-align:center;" class="order-para">The Team at<strong> @"Interiorfilmteam"</strong></p>
         <div class="purchase-details">
            <h3>Purchase Details</h3>
            <table class="purchase-table">
               <thead>
                  <tr>
                     <th style="padding: 10px 2px; width: 60%" class="table-font">Product</th>
                     <th style="padding: 10px 2px;  width: 25%; text-align: center;" class="table-font">Product Price</th>
                     <th style="padding: 10px 2px;  width: 15%; text-align: center;" class="table-font">Price</th>
                  </tr>
               </thead>


               <tbody>
                  ${productDetails.map((product, index) => `
                  <tr key="${index}">
                     <td style="padding: 10px 2px;" class="product-title-wrapper">
                        <div style="display:flex; gap:5px; align-items:center; justify-content:center;">
                           <img
                              src="${product.imageUrl}"
                              alt="${product.name}" style="height:70px; width:70px;" class="product-img">
                           <div>
                              <p class="table-font" style="margin-left: 5px; margin-bottom: 0px; margin-top: 0px; color: black; font-weight: 600;">${product.name}</p>
                              <p class="table-font" style="margin-left: 5px; margin-bottom: 0px; margin-top: 8px; color: black;"><b>Code:</b> ${product.code}</p>
                               ${product.length && `<p class="table-font" style="margin-left: 5px; margin-bottom: 0px; margin-top: 8px;"><b>Size:</b> 1.22 x ${product.length}m</p>`} 
                           </div>
                        </div>
                     </td>
                     <td class="table-font" style="text-align:center; padding: 10px 2px;">
  <img src="https://res.cloudinary.com/dckxfl2yn/image/upload/v1745233698/dirham_izkz2q_ijkefr.jpg" alt="currency icon" width="11" height="11" />
  ${product.price}
</td>

                     <td class="table-font" style="text-align:center; padding: 10px 2px;"><img src="https://res.cloudinary.com/dckxfl2yn/image/upload/v1745233698/dirham_izkz2q_ijkefr.jpg" alt="currency icon" width="11" height="11" /> ${product.totalPrice}</td>
                  </tr>
                  `).join('')}






               </tbody>


            </table>

            <body style="font-family: Arial, sans-serif; text-align: center; margin: 0; padding: 0;">
               <table style="width: 100%; border-collapse: collapse; text-align: left; margin: auto;">
                  <tr>
                     <td style="width: 65%; vertical-align: top; padding: 10px  10px 10px 0px ; border-right: 2px solid #ccc;" class="user-info-wrapper">
                        <table>
                           <tr>
                              <th style="padding: 5px 5px 0px 5px;" class="table-font">Name:</th>
                           </tr>
                           <tr>
                              <td style="padding: 0px 5px 5px 5px; width: 100%;" class="table-font">${name}</td>
                           </tr>
                           <tr>
                              <th style="padding: 5px 5px 0px 5px;" class="table-font">Email:</th>
                           </tr>
                           <tr>
                              <td style="padding: 0px 5px 5px 5px; width: 100%;" class="table-font">${email}</td>
                           </tr>
                           <tr>
                              <th style="padding: 5px 5px 0px 5px;" class="table-font">Phone:</th>
                           </tr>
                           <tr>
                              <td style="padding: 0px 5px 5px 5px; width: 100%;" class="table-font">${phone}</td>
                           </tr>
                           <tr>
                              <th style="padding: 5px 5px 0px 5px;" class="table-font">Address:</th>
                           </tr>
                           <tr>
                              <td style="padding: 0px 5px 5px 5px; width: 100%;" class="table-font">${address}, ${State}</td>
                           </tr>
                        </table>
                     </td>
                        
                     <td style="width: 35%;  padding: 10px 5px;" class="total-wrapper">
                        <table style="border-collapse: collapse;">
                           <tr>
                              <td colspan="5" style="padding: 8px;" class="table-font">Subtotal</td>
                              <td style="padding: 8px 4px;white-space:nowrap;" class="table-font"><img src="https://res.cloudinary.com/dckxfl2yn/image/upload/v1745233698/dirham_izkz2q_ijkefr.jpg" alt="currency icon" width="11" height="11" /> ${TotalProductsPrice}</td>
                           </tr>
                           <tr style="border-bottom: 2px solid #ccc;">
                              <td colspan="5" style="padding: 8px;" class="table-font">Shipment</td>
                              <td style="padding: 8px 4px;     white-space: nowrap;" class="table-font">
                                ${shippment_Fee === 0 || shippment_Fee === '0'
            ? "Free"
            : `<img src="https://res.cloudinary.com/dckxfl2yn/image/upload/v1745233698/dirham_izkz2q_ijkefr.jpg" alt="currency icon" width="11" height="11" style="vertical-align: middle; margin-right: 2px;" />${shippment_Fee}`
         }
                              </td>
                                    
                           </tr>
                           <tr>
                              <td colspan="5" style="padding: 8px; font-weight: bold; " class="table-font">Total</td>
                              <td style="padding: 8px 4px;; font-weight: bold;white-space: nowrap;" class="table-font"><img src="https://res.cloudinary.com/dckxfl2yn/image/upload/v1745233698/dirham_izkz2q_ijkefr.jpg" alt="currency icon" width="11" height="11" /> ${Number(shippment_Fee) + TotalProductsPrice}</td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
               </td>
               </tr>
               </table>
         </div>

         <div style="text-align: center; margin-top: 20px; background-color: #fb7320; padding: 14px;">
            <img src="https://res.cloudinary.com/dgwsc8f0g/image/upload/v1739185483/features_lbnmr6.png" alt="features"
               style="display: block; margin: auto; max-width: 100%; height: auto;">
         </div>
</body>
<div class="categories">
   <a target="_blank" href="https://interiorfilm.ae/products?category=metal-series">METAL</a>
   <a target="_blank" href="https://interiorfilm.ae/products?category=symphony-series">SYMPHONY</a>
   <a target="_blank" href="https://interiorfilm.ae/products?category=skin-touch-series">SKIN TOUCH</a>
   <a target="_blank" href="https://interiorfilm.ae/products?category=plain-series">PLAIN</a>
   <a target="_blank" href="https://interiorfilm.ae/products?category=marble-series">MARBLE</a>
   <a target="_blank" href="https://interiorfilm.ae/products?category=leather-series">LEATHER</a>
   <a target="_blank" href="https://interiorfilm.ae/products?category=cement-grey-series" class="word-wrap">CEMENT GREY</a>
</div>
<div class="social-icons">
   <a href="https://www.facebook.com/Interiorfilmuae" target="_blank"> <img
         src="https://res.cloudinary.com/dgwsc8f0g/image/upload/v1739185482/facebook-icon_tdqcrw.png"></a>
   <a href="https://www.pinterest.com/interiorfilmuae/" target="_blank"> <img
         src="https://res.cloudinary.com/dgwsc8f0g/image/upload/v1739185483/pinterest-icon_dsvge7.png"
         alt="pinterest"></a>
</div>
</div>
</body>

</html>`


   };


   try {
      transporter.sendMail(mailOptions, function (error, info) {
         if (error) {
            console.error('Error sending email:', error);
            throw new Error(error.message || JSON.stringify(error))

         } else {
            console.log('Email sent:', info.response);
            return info.response
         }
      });
   } catch (error) {
      throw new Error(error.message)
   }


};


const send_promotional_mails = (user_email, content, subject) => {
   const htmlFilePath = path.join(__dirname, 'template/promotional_email/index.html');
   fs.readFile(htmlFilePath, 'utf-8', (err, htmlContent) => {
      if (err) {
         console.error('Error reading HTML file:', err);
         return;
      }

      const mailOptions = {
         from: process.env.MAILER_MAIL,
         to: user_email,
         subject: subject ? subject : 'Promotional Mail',
         html: htmlContent
      };

      try {
         transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
               console.error('Error sending email:', error);
            } else {
               console.log('Email sent:', info.response);
            }
         });
      } catch (error) {
         console.error('Error during mail sending:', error.message);
      }
   });
}



module.exports = {
   sendEmailHandler,
   send_promotional_mails
};
