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
//   <td><span style="background-color: #${product.color}; display: inline-block; width: 20px; height: 20px; border-radius: 50%;"></span></td>
// <th >color</th>


const sendEmailHandler = async (name, email, phone, address, State, TotalProductsPrice, productDetails, shippment_Fee, subject, CustomerEmail) => {
    console.log("name", TotalProductsPrice);

    const mailOptions = {
        from: process.env.MAILER_MAIL,
        to: CustomerEmail ? CustomerEmail : `${process.env.CONTACTUS_MAIL1},${process.env.CONTACTUS_MAIL2}`
        // to: `mujtaba.shafique01@gmail.com`
        ,
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
            max-width: 700px;
            margin: 20px auto;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-top: 5px solid #FB7320;
            border-bottom: 5px solid #FB7320;
        }

        .main-container {
            padding: 20px;
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
            color: white;
            padding: 10px;
            margin: 20px auto;
            text-decoration: none;
            border-radius: 1px;
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

        .categories {
            padding: 15px;
            border-top: 2px solid #ccc;
        }

        .categories span {
            margin: 0 10px;
            font-weight: bold;
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
            padding:30px;
        }

        .feature {
            text-align: center;
        }

        .feature img {
            width: 30px;
            height: auto;
        }

        .categories {
            margin-top: 10px;
            padding: 15px;
            border-top: 2px solid #ccc;
            border-bottom: 2px solid #ccc;
        }

        .categories span {
            margin: 0 10px;
            font-size: 14px;
            font-weight: 100;
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
            gap: 20px;
            width: 100%;
            align-items: center;
            padding:30px;
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
    </style>
</head>

<body>
    <div class="container">
        <div class="main-container">
            <div class="header" style="text-align:center;">
                <img src="https://res.cloudinary.com/dz7nqwiev/image/upload/v1727692832/interiorFilms/Logo_Images/logo_sdrxse.png"
                    alt="Brand Logo">
            </div>
            <h4 style="text-align:center;">ORDER#</h4>
            <p style="text-align:center;">Dec 10, 2025</p>
            <h1 style="text-align:center;">Order Confirmed</h1>

            <div class="progress-container" style="text-align:center;">
                <img src="https://res.cloudinary.com/dgwsc8f0g/image/upload/v1739185485/status_xqtm6k.png" alt="Progress Status">
            </div>
            <p style="text-align:center;">Dear Customer,</p>
            <p style="text-align:center;">Thank you very much for the order you placed with <a
                    href="https://interiorfilm.ae/">www.interiorfilm.ae</a></p>
            <a href="#" class="order-button">View Your Order</a>
            <p style="text-align:center;">Your order has now been sent to the warehouse to prepare for packing and
                dispatch.</p>
            <p style="text-align:center;">Our team will be in touch soon to arrange the delivery with you.</p>
            <p style="text-align:center;">All The Best,</p>
            <p style="text-align:center;"><strong>The Team at "Interiorfilm"</strong></p>
            <div class="purchase-details">
                <h3>Purchase Details</h3>
                <table class="purchase-table">
                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th >Product</th>
                                            <th >Code</th>
                                            <th style="text-align:center;" >Size</th>
                                            <th>Product Price</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>


                         <tbody>
                                        ${productDetails.map((product, index) => `
                                            <tr>
                                                <td>${index + 1}</td>
                                                <td><div style="display:flex;gap:10px; align-items:center; justify-content:center; width: 200px">
                                                <p> <img src="${product.imageUrl}" alt="${product.name}" style="height:40px; width:40px;"></p> 
                                                 <p style="margin-left: 10px">${product.name}</p></div></td>
                                                    <td>${product.code}</td>
                                                <td style="text-align:center;">1.22 x ${product.length}m</td>
                                                <td style="text-align:center;">${product.price}</td>
                                                <td style="text-align:center;">${product.totalPrice}</td>
                                            </tr>
                                        `).join('')}


                                   



                                    </tbody> 


                                </table>

                                <body style="font-family: Arial, sans-serif; text-align: center; margin: 0; padding: 0;">
    <table style="width: 100%; border-collapse: collapse; text-align: left; margin: auto;">
        <tr>
            <td style="width: 50%; vertical-align: top; padding: 10px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="padding: 5px;">Customer Name:</th>
                        <td style="padding: 5px;">${name}</td>
                    </tr>
                    <tr>
                        <th style="padding: 5px;">Customer Email:</th>
                        <td style="padding: 5px;">${email}</td>
                    </tr>
                    <tr>
                        <th style="padding: 5px;">Customer Phone:</th>
                        <td style="padding: 5px;">${phone}</td>
                    </tr>
                    <tr>
                        <th style="padding: 5px;">Customer Address:</th>
                        <td style="padding: 5px;">${address}, ${State}</td>
                    </tr>
                </table>
            </td>
            <td style="width: 50%; vertical-align: top; padding: 10px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 2px solid #ccc;">
                        <td colspan="5" style="padding: 5px;">Subtotal</td>
                        <td style="padding: 5px;">${TotalProductsPrice}</td>
                    </tr>
                    <tr style="border-bottom: 2px solid #ccc;">
                        <td colspan="5" style="padding: 5px;">Shipment</td>
                        <td style="padding: 5px;">${TotalProductsPrice > 250 ? "Free" : 20}</td>
                    </tr>
                    <tr>
                        <td colspan="5" style="padding: 5px; font-weight: bold;">Total</td>
                        <td style="padding: 5px; font-weight: bold;">${TotalProductsPrice > 250 ? TotalProductsPrice : 20 + TotalProductsPrice}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    </div>
    
    <div style="text-align: center; margin-top: 20px; background-color: #fb7320; padding: 14px;">
        <img src="https://res.cloudinary.com/dgwsc8f0g/image/upload/v1739185483/features_lbnmr6.png" alt="features" style="display: block; margin: auto; max-width: 100%; height: auto;">
    </div>
</body>
        <div class="categories">
            <span>METAL</span>
            <span>SYMPHONY</span>
            <span>SKIN TOUCH</span>
            <span>PLAIN</span>
            <span>MARBLE</span>
            <span>LEATHER</span>
            <span>CEMENT GREY</span>
        </div>
        <div class="social-icons">
            <a href="#"> <img src="https://res.cloudinary.com/dgwsc8f0g/image/upload/v1739185483/linkedin-icon_z7kyeq.png" alt="linkedin"></a>
            <a href="https://www.facebook.com/Interiorfilmuae"> <img src="https://res.cloudinary.com/dgwsc8f0g/image/upload/v1739185482/facebook-icon_tdqcrw.png"></a>
            <a href="https://www.pinterest.com/interiorfilmuae/"> <img src="https://res.cloudinary.com/dgwsc8f0g/image/upload/v1739185483/pinterest-icon_dsvge7.png" alt="pinterest"></a>
        </div>
    </div>
</body>

</html>`
        //         html: `

        //             <!DOCTYPE html>
        //             <html lang="en">
        //             <head>
        //                 <meta charset="UTF-8">
        //                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //                 <title>Payment Received</title>
        //                 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        //                 <style>
        //                     body {
        //                         font-family: Arial, sans-serif;
        //                         margin: 0;
        //                         padding: 0;
        //                         background-color: #f4f4f4;
        //                     }
        //                     .container {
        //                         max-width: 700px;
        //                         margin: 20px auto;
        //                         background-color: #fff;
        //                         padding: 20px;
        //                         box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        //                     }
        //                     .header {
        //                         text-align: center;
        //                         padding: 10px 0;
        //                     }
        //                     .header img {
        //                         max-width: 100px;
        //                     }
        //                     .content {
        //                         text-align: left;
        //                     }
        //                     .content h2 {
        //                         color: #333;
        //                         text-align: center;
        //                     }
        //                     .order-summary {
        //                         width: 100%;
        //                         margin-top: 20px;
        //                         border-collapse: collapse;
        //                     }
        //                     .customer-info {
        //                         width: 35%;
        //                         margin-top: 20px;
        //                         border-collapse: collapse;
        //                         margin-left: auto;
        //                         margin-right:auto
        //                     }
        //                     .order-summary th, .order-summary td, .customer-info th, .customer-info td {
        //                         padding: 10px;
        //                         text-align: left;
        //                     }
        //                     .order-summary th {
        //                         background-color: #f4f4f4;
        //                     }
        //                     .order-summary {
        //                         border-spacing: 1px;
        //                     }
        //                     .customer-info {
        //                        display:flex !important;
        //   align-items:center !important;
        //   justify-content:center !important;
        //                     }
        //                     .customer-info th, .customer-info td {
        //                         border: none;
        //                         display: table-cell;
        //                     }
        //                     .total_Amount {
        //                         padding: 10px 0 !important;
        //                         border-top: 1px solid #E4E4E4;
        //                         border-bottom: 1px solid #E4E4E4;
        //                     }
        //                     .social-icons {
        //                      display: flex;
        //     margin: 20px auto;
        //     width: 18%;

        //                         margin-top: 20px;
        //                         text-align:center
        //                     }
        //                     .social-icons a {
        //                         width: 40px;
        //                         height: 40px;
        //                         display: flex;
        //                         justify-content: center;
        //                         align-items: center;
        //                         background-color: #fff;

        //                         text-decoration: none;
        //                     }

        //                     .social-icons a i {
        //                         font-size: 18px;
        //                         color: #333;
        //                     }
        //  .msg-434132501558709343 .m_-434132501558709343social-icons {
        //    display:flex !important;
        //   align-items:center !important;
        //   justify-content:center !important;
        // }
        // @media only screen and (max-width: 360px){
        //     .order-summary th, .order-summary td, .customer-info th, .customer-info td {
        //                         padding: 4px;

        //                     }
        // }

        //                 </style>
        //             </head>
        //             <body>


        //                 <div class="container">
        //                     <div class="header">
        //                         <img src="https://res.cloudinary.com/dz7nqwiev/image/upload/v1727692832/interiorFilms/Logo_Images/logo_sdrxse.png" alt="Brand Logo" style="max-width: 200px; margin-bottom: 20px;">
        //                     </div>
        //                     <div class="content">
        //                         <h2>Order has been confirmed Successfully</h2>
        //                         <p>Dear ${name},</p>
        //                         <p>Thank You For Shopping With Us. We Have Received Your Order And It Is Being Processed. Here Is A Summary Of Your Order:</p>

        //                         <h2>Order Summary</h2>
        //                         <table class="order-summary">
        //                             <thead>
        //                                 <tr>
        //                                     <th>#</th>
        //                                     <th >Product</th>
        //                                     <th >Code</th>
        //                                     <th style="text-align:center;" >Size</th>
        //                                     <th>Product Price</th>
        //                                     <th>Price</th>
        //                                 </tr>
        //                             </thead>


        //                  <tbody>
        //                                 ${productDetails.map((product, index) => `
        //                                     <tr>
        //                                         <td>${index + 1}</td>
        //                                         <td><div style="display:flex;gap:10px; align-items:center; justify-content:center; width: 200px">
        //                                         <p> <img src="${product.imageUrl}" alt="${product.name}" style="height:40px; width:40px;"></p> 
        //                                          <p style="margin-left: 10px">${product.name}</p></div></td>
        //                                             <td>${product.code}</td>
        //                                         <td style="text-align:center;">1.22 x ${product.length}m</td>
        //                                         <td style="text-align:center;">${product.price}</td>
        //                                         <td style="text-align:center;">${product.totalPrice}</td>
        //                                     </tr>
        //                                 `).join('')}


        //                                 <tr class="total_Amount">
        //                                     <td colspan="5" style="text-align:left;">TOTAL</td>
        //                                     <td>${TotalProductsPrice}</td>
        //                                 </tr>
        //                                 <tr class="total_Amount">
        //                                        <td colspan="5" style="text-align:left;">Shipment Fee</td>
        //                                        <td>${TotalProductsPrice > 250 ? "Free" : 20}</td>
        //                                    </tr>
        //                                 <tr class="total_Amount">
        //                                     <td colspan="5" style="text-align:left;">Grand TOTAL</td>
        //                                     <td>${TotalProductsPrice > 250 ? TotalProductsPrice : 20 + TotalProductsPrice}</td>
        //                                 </tr>



        //                             </tbody> 


        //                         </table>

        //                         <h3 style="text-align:center;">Customer Information</h3>
        //                         <div style="display:flex; justify-content: center; width: 70%; margin:auto; border: 1px solid #D9D9D9; border-radius:6px">

        //                                 <table class="customer-info" style="display:flex;align-items:center;justify-content:center; ">
        //                                     <tr>
        //                                         <th>Name:</th>
        //                                         <td>${name}</td>
        //                                     </tr>
        //                                     <tr>
        //                                         <th>Email:</th>
        //                                         <td>${email}</td>
        //                                     </tr>
        //                                     <tr>
        //                                         <th>Phone:</th>
        //                                         <td>${phone}</td>
        //                                     </tr>
        //                                     <tr>
        //                                         <th>Address:</th>
        //                                         <td>${address}, ${State} </td>
        //                                     </tr>
        //                                 </table>



        //                         </div>
        //                     </div>

        //                     <!-- <div class="social-icons" style="display: flex; align-items: center; justify-content: center;">
        //                         <a href="https://www.facebook.com/artiartuae" target="_blank">
        //                         <img src="https://res.cloudinary.com/dz7nqwiev/image/upload/v1727692832/interiorFilms/Logo_Images/logo_sdrxse.png" alt="Brand Logo" style="max-width: 200px; margin-bottom: 20px;">

        //                         </a>
        //                     </div> -->



        //                     <div style="text-align: center; margin-top: 20px;">

        //                         <p>We Will Notify You Once Your Order Is Shipped.</p>

        //                         <p>If You Have Any Questions, Feel Free To Contact Us At <a href="mailto:Info@Interiorfilm.Ae" target="_blank" rel="noopener" style="text-decoration:none;">Info@Interiorfilm.Ae</a> </p>

        //                     </div>



        //                       <div>

        //                     <!-- <p>Regards</p>
        //                     <p>The Interior Films Team</p>
        //                      -->
        //                     </div>

        //                     <div style="text-align: center;">
        //                         <img src="https://res.cloudinary.com/dz7nqwiev/image/upload/v1727692832/interiorFilms/Logo_Images/logo_sdrxse.png" alt="Brand Logo" style="max-width: 200px; margin-bottom: 20px;">
        //                     </div>
        //                 </div>


        //             </body>
        //             </html>



        //         `,

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
