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
            overflow-x: hidden; /* Prevent horizontal scrolling */
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
            overflow-x: auto; /* Enable horizontal scrolling for tables */
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

            .user_details table {
                width: 100% !important;
            }

            .user_details tr, 
            .user_details td {
                display: block;
                width: 100% !important;
                text-align: left;
            }

            .user_details td {
                border-right: none; /* Remove border for mobile */
                padding: 10px 0; /* Adjust padding for mobile */
            }

            .user_details tr {
                margin-bottom: 10px; /* Add space between rows */
            }
        }


              background-color: #FFF9F5;
            padding: 15px;
            margin-top: 20px;
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

        /* Desktop Table (Hidden on Mobile) */
        @media (max-width: 600px) {
            .purchase-details {
                display: none;
            }
        }

        /* Mobile Layout */
        .purchase-details-mobile {
            display: none;
            background-color: #FFF9F5;
            padding: 15px;
            margin-top: 20px;
        }

        @media (max-width: 600px) {
            .purchase-details-mobile {
                display: block;
            }

            .mobile-product {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                background: white;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }

            /* Image and name in column form */
            .mobile-product .left {
                width: 100%;
                text-align: center;
                margin-bottom: 10px;
            }

            .mobile-product img {
                height: 60px;
                width: 60px;
                border-radius: 5px;
                display: block;
                margin: 0 auto;
            }

            .mobile-product p {
                margin: 5px 0 0;
                font-size: 14px;
                font-weight: bold;
            }

            /* Product details in a column */
            .mobile-product .right {
                width: 100%;
                text-align: center;
            }

            .mobile-product .right p {
                margin: 5px 0;
                font-size: 14px;
            }

            .product-price {
                font-weight: bold;
                color: #FB7320;
                font-size: 16px;
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
              <!-- Desktop Table -->
            <div class="purchase-details">
                <h3>Purchase Details</h3>
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
                                        <p>${product.name}</p>
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

            <!-- Mobile View -->
              <div class="purchase-details-mobile">
                <h3>Purchase Details</h3>
                ${productDetails.map((product, index) => `
                    <div class="mobile-product">
                        <div class="left">
                            <img src="${product.imageUrl}" alt="${product.name}">
                            <p>${product.name}</p>
                        </div>
                        <div class="right">
                            <p><strong>Code:</strong> ${product.code}</p>
                            <p><strong>Size:</strong> ${product.length}m</p>
                            <p><strong>Price:</strong> <span class="product-price">${product.price}</span></p>
                        </div>
                    </div>
                `).join('')}
                
            </div>

            <table style="width: 100%; border-collapse: collapse; text-align: left; margin: auto;" class="user_details">
                <tr>
                    <td style="width: 60%; vertical-align: top; padding: 10px; border-right: 2px solid #ccc;">
                        <table style="width: 100%; border-collapse: collapse;">
                             <tr style="display: flex; flex-wrap: wrap; width: 100%;">
                                <th style="padding: 5px;">Name:</th>
                                <td style="padding: 5px;">${name}</td>
                            </tr>
                             <tr style="display: flex; flex-wrap: wrap; width: 100%;">
                                <th style="padding: 5px;">Email:</th>
                                <td style="padding: 5px;">${email}</td>
                            </tr>
                           <tr style="display: flex; flex-wrap: wrap; width: 100%;">
                                <th style="padding: 5px;">Phone:</th>
                                <td style="padding: 5px;">${phone}</td>
                            </tr>
                             <tr style="display: flex; flex-wrap: wrap; width: 100%;">
                                <th style="padding: 5px;"> Address:</th>
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
