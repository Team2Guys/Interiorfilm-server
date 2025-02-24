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


const sendEmailHandler = async (name, email, phone, address, State, TotalProductsPrice, productDetails, shippment_Fee, subject, CustomerEmail, purchaseDate, orderId) => {

    const mailOptions = {
        from: process.env.MAILER_MAIL,
        to: CustomerEmail ? CustomerEmail : `${process.env.CONTACTUS_MAIL1},${process.env.CONTACTUS_MAIL2}`,
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
            max-width: 40%;
            height: auto;
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
            border-radius: 5px;
        }

        .purchase-details {
            background-color: #FFF9F5;
            padding: 15px;
            margin-top: 20px;
            overflow-x: auto;
        }

        .purchase-table {
            width: 100%;
            border-collapse: collapse;
        }

        .purchase-table th,
        .purchase-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        .purchase-table img {
            height: 40px;
            width: 40px;
        }

        .footer {
            background-color: #FB7320;
            color: white;
            text-align: center;
            padding: 15px 0;
            margin-top: 20px;
        }

        .summary {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-top: 20px;
        }

        .summary div {
            width: 100%;
            max-width: 350px;
            padding: 10px;
            box-sizing: border-box;
        }

        .summary table {
            width: 100%;
            border-collapse: collapse;
        }

        .summary th, .summary td {
            padding: 8px;
            text-align: left;
        }

        @media (max-width: 600px) {
            .summary {
                flex-direction: column;
                align-items: center;
            }

            .summary div {
                max-width: 100%;
            }

            .purchase-table th, .purchase-table td {
                font-size: 14px;
            }
        }
            @media screen and (max-width: 600px) {
   .user_details table {
        width: 100% !important;
   }
   
   .user_details tr, 
   .user_details td {
        display: block;
        width: 100% !important;
        text-align: left;
   }
}
    </style>
</head>

<body>
    <div class="container">
        <div class="main-container">
            <div class="header">
                <img src="https://res.cloudinary.com/dgwsc8f0g/image/upload/v1740381671/logo_vankie.png" alt="InteriorFilm ">
            </div>
            <h3 style="text-align:center;">ORDER#${orderId}</h3>
            <p style="text-align:center;">${purchaseDate}</p>
            <h1 style="text-align:center;">Order Confirmed</h1>
            <a href="#" class="order-button">View Your Order</a>
            <div class="purchase-details">
                <h3>Purchase Details</h3>
                <div style="overflow-x:auto;">
                    <table class="purchase-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Code</th>
                                <th>Size</th>
                                <th>Product Price</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productDetails.map((product, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:10px;">
                                            <img src="${product.imageUrl}" alt="${product.name}">
                                            <p style="min-width: 102px;">${product.name}</p>
                                        </div>
                                    </td>
                                    <td>${product.code}</td>
                                    <td>${product.length}m</td>
                                    <td>${product.price}</td>
                                    <td>${product.totalPrice}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
           <table style="width: 100%; border-collapse: collapse; text-align: left; margin: auto;" class="user_details">
    <tr>
        <td style="width: 60%; vertical-align: top; padding: 10px; border-right: 2px solid #ccc;">

        
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

   <td style="width: 40%; padding: 10px;">
    <table style="width: 100%; border-collapse: collapse;">
        <tr style="display: flex; justify-content: space-between; width: 100%;">
            <td style="padding: 8px;">Subtotal</td>
            <td style="padding: 8px;">${TotalProductsPrice}</td>
        </tr>
        <tr style="display: flex; justify-content: space-between; width: 100%; border-bottom: 2px solid #ccc;">
            <td style="padding: 8px;">Shipment</td>
            <td style="padding: 8px;">${TotalProductsPrice > 1000 ? "Free" : 20}</td>
        </tr>
        <tr style="display: flex; justify-content: space-between; width: 100%; font-weight: bold;">
            <td style="padding: 8px;">Total</td>
            <td style="padding: 8px;">${TotalProductsPrice > 250 ? TotalProductsPrice : 20 + TotalProductsPrice}</td>
        </tr>
    </table>
</td>
       
    </tr>
</table>
        </div>
        <div class="footer">
            <p>&copy; InteriorFilm. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
`
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
