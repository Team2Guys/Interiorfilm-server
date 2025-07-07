require("dotenv").config();

const Productdb = require('../models/productModel.js');
const CategoryDb = require('../models/categoriesModel.js');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const dburl = require('../utils/dbhandlers.js')

const Sales = require('../models/salesModel.js');



cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});

exports.addProduct = async (req, res) => {
    try {
        const name = req.body.name
        const code = req.body.code;

        console.log(code, "code", "name", name)
        if (!name || !code) return res.status(400).json({
            error: "Product name or code not found",
        })
        let totalQuntity = req.body.totalStockQuantity
        let existingProduct = await Productdb.findOne({ $or: [{ name: name }, { code: code }] });

        console.log("existingProduct", existingProduct)

        if (!totalQuntity) {
            const variantStockQuantities = req.body.variantStockQuantities || [];
            let totalStockQuantity = 0;

            variantStockQuantities.forEach(variant => {
                if (variant.quantity && !isNaN(variant.quantity)) {
                    totalStockQuantity += parseInt(variant.quantity, 10);
                }
            });
            req.body.totalStockQuantity = totalStockQuantity;


        }


        if (existingProduct) return res.status(400).json({
            error: "Product Already Exist",
        })
        if (!req.body) return res.status(404).json({ message: "no product found" })
        const newProduct = new Productdb(req.body)
        await newProduct.save();
        return res.status(200).json({
            message: "products has been saved"
        })
    }
    catch (err) {
        console.log(err, 'err occured')
        return res.status(500).json({
            error: "Internal server error",
            err
        })
    }

}

exports.getAllproducts = async (req, res) => {
    try {
        let products = await Productdb.find();
        if (!products) {
            return res.status(200).json({ message: "No products found" })
        }
        return res.status(200).json({
            message: "products has been saved",
            products
        })


    } catch (err) {
        return res.status(500).json({
            error: "errror Occured",
        })

    }

}
exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        let products = await Productdb.findByIdAndDelete(productId);
        if (!products) {
            return res.status(404).json({
                message: "Product not found",
            })
        }
        return res.status(200).json({
            message: "product has been deleted",
            products
        })


    } catch (err) {
        return res.status(500).json({
            error: "errror Occured",
        })

    }

}

exports.userOrderHistory = async (req, res) => {
    try {
        console.log(req.headers.token);
        console.log("AYLO");
        // const decoded = jwt.verify(req.headers.token, process.env.secKey);
        // const userEmail = decoded.email;
        const userEmail = req.email


        console.log('Authenticated user email:', userEmail);
        const userSales = await Sales.find({ usermail: userEmail });

        if (!userSales || userSales.length === 0) {
            return res.status(404).json({
                message: 'No order history found for this user',
            });
        }

        return res.status(200).json({
            products: userSales,
        });
    } catch (err) {
        console.error('Error occurred during fetching order history:', err);
        return res.status(500).json({
            error: 'Internal server error',
            err,
        });
    }


}
exports.trackorder = async (req, res) => {
    const orderId = req.params.orderId;
    console.log('Order ID:', orderId);

    try {


        const saleRecord = await Sales.findOne({ "products": { $elemMatch: { order_id: orderId } } });
        console.log("AYLO");
        console.log(saleRecord);

        if (!saleRecord) throw new Error('Product not found');

        let filteredProduct = saleRecord.products.filter((item) => item.order_id == orderId)

        if (!filteredProduct || filteredProduct.length === 0) {
            return res.status(404).json({
                message: 'No product found for this user',
            });
        }
        return res.status(200).json({
            userDetails: saleRecord,
            products: filteredProduct,
        });
    } catch (err) {
        console.error('Error occurred during fetching getting order detail:', err);
        return res.status(500).json({
            error: 'Internal server error',
            err,
        });
    }


}



exports.productHanler = async (req, res) => {
    const productId = req.params.id;
    const updateData = req.body;

    try {
        const updatedProduct = await Productdb.findByIdAndUpdate(productId, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getProduct = async (req, res) => {

    try {
        const productId = req.params.id;
        console.log(productId, "productId")
        let product = await Productdb.findById(productId);
        console.log(product, "product")

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({ product })
    } catch (err) {
        consoe.log(err, "err")
        return res.status(500).json({ error: 'internal Server error' });
    }


}




// Category 

exports.AddCategory = async (req, res) => {
    try {
        const { name, posterImageUrl } = req.body;
        if (!req.body) return res.status(401).json({ error: 'Data not found' });
        const existingCategory = await CategoryDb.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        // Create a new category
        const newCategory = new CategoryDb({ name, posterImageUrl });
        await newCategory.save();
        return res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getAllcategories = async (req, res) => {
    try {
        const Categories = await CategoryDb.find();

        return res.status(201).json(Categories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


exports.getCategory = async (req, res) => {

    try {
        const productId = req.params.id;
        console.log(productId, "productId")
        let product = await CategoryDb.findById(productId);
        console.log(product, "product")

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({ product })
    } catch (err) {
        consoe.log(err, "err")
        return res.status(500).json({ error: 'internal Server error' });
    }


}
exports.getProductHandler = async (req, res) => {
    try {
        const categoryId = req.params.id;

        let category = await CategoryDb.findById(categoryId)
        if (!category) {
            return res.status(404).json({ error: 'No Category found' });
        }
        return res.status(201).json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.editCategoryHandler = async (req, res) => {

    try {
        const categoryId = req.params.id;
        const updateData = req.body;
        const category = await CategoryDb.findByIdAndUpdate(categoryId, updateData, { new: true });
        if (!category) {
            return res.status(404).json({ error: 'category not found' });
        }
        return res.status(200).json(category);
    } catch (err) {
        console.log('error', err)
        return res.status(500).json({ message: 'Internal server error' });

    }


}


exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
        let category = await CategoryDb.findByIdAndDelete(categoryId);
        if (!category) return res.status(404).json({ error: "Category not found", })

        return res.status(200).json({ message: "category has been deleted", category })
    } catch (err) {
        return res.status(500).json({ error: "errror Occured", })

    }

}

exports.addProductImage = async (req, res) => {
    try {
        const files = req.files;
        const productImageUrl = []
        if (!files || files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }


        for (const file of files) {
            console.log(file.path, "file")


            const result = await cloudinary.uploader.upload(file.path, {
                folder: "interiorFilms"
            });
            console.log('File uploaded successfully:', result);
            let Image_detail = {
                public_id: result.public_id,
                imageUrl: result.url
            }

            productImageUrl.push(Image_detail)
        }


        res.status(200).json({
            productsImageUrl: productImageUrl
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            errorMessage: "internal server errror",
            error: err
        });
    }
};


exports.deleteProductImage = async (req, res) => {
    try {
        const imageUrl = req.body.imageUrl;
        console.log(imageUrl, "imageUrl")
        if (!imageUrl) {
            return res.status(400).send('Image URL is required.');
        }

        let result = await cloudinary.uploader.destroy(imageUrl);

        console.log('Image deleted successfully:', result);

        res.status(200).send('Image deleted successfully.');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }

};


const transporter = nodemailer.createTransport({
    host: 'mail.blindsandcurtains.ae',
    port: 587,
    secure: false,
    auth: {
        user: `${process.env.ADMIN_MAIL}`,
        pass: `${process.env.ADMIN_PASSWORD}`,
    },
});

exports.sendEmailHandler = async (req, res) => {
    const { user_name, user_email, comment, user_phone } = req.body;
    try {
        const emailTemplate = `<!DOCTYPE html>
  <html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        .container {
    
            background-color: #f5f5f5;
            padding: 20px;
        }

        .logo-wrapper {
            text-align: center;
            margin-bottom: 20px;
        }

        .email-content-wrapper {
            background-color: white;
            padding: 40px 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: left;
            text-transform: capitalize;
        }

        .email-content-wrapper h1 {
            text-align: center;
            color: #d5232e;
            font-size: 28px;
            margin-bottom: 30px;
            padding-top: 30px;
        }

        .email-content-wrapper p {
            font-size: 16px;
            margin-bottom: 30px;
            padding: 0px 20px;
            line-height: 1.5;
        }

        .customer-info-wrapper {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .customer-info{
            max-width: fit-content;
            margin: 0 auto;
        }
        .customer-info p {
            margin: 20px 0;
            font-size: 16px;
        }

        .customer-info p span {
            font-weight: bold;
            display: inline-block;
            width: 70px;
        }
 .vieworder_btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            margin-bottom: 30px;
        }
        @media (max-width: 600px) {
            .container{
                padding: 20px 10px;
            }
            .email-content-wrapper {
                padding: 30px 10px;
            }

            .email-content-wrapper h1 {
                font-size: 20px;
            }

            .email-content-wrapper p,
            .customer-info p {
                font-size: 14px;
            }

            .customer-info-wrapper {
                padding: 15px 10px;
            }
            .customer-info-wrapper p{
                padding: 0px;
            }
             .vieworder_btn {
                padding: 8px 16px;
            }
        }
    </style>
</head>

<body>
    <section class="container">
        <div class="logo-wrapper">
            <img src="https://res.cloudinary.com/dqvywckz8/image/upload/v1740575139/Frame_1321315836_z0ujlv.jpg" alt="logo"  height="50">
        </div>
        <div class="email-content-wrapper">
              
            <p>${comment}</p>
            <h1>Customer Information</h1>
            <div class="customer-info-wrapper">
                <div class="customer-info">
                <p><span>Name:</span>${user_name}</p>
              <p ><span>Email:</span> <span style="text-transform: lowercase;font-weight:400">${user_email}</span></p>
                <p><span>Phone:</span> ${user_phone}</p>

            </div>
            </div>
        </div>
    </section>
</body>

</html>
`
        const mailOptions = {
            from: process.env.MAILER_MAIL,
            to: user_email,
            subject: 'New message from contact form',
            html: emailTemplate


        };

        await transporter.sendMail({
            from: `"Contact us form " ${process.env.MAILER_MAIL}`,
            to: `${process.env.CONTACTUS_MAIL1},${process.env.CONTACTUS_MAIL2},${process.env.CONTACTUS_MAIL3} ${process.env.CONTACTUS_MAIL4}`,
            subject: 'New message from contact form',
            html: emailTemplate,
        });

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                throw new Error('Error sending email')
            } else {
                console.log('Email sent:', info.response);
                res.status(200).send('Email sent successfully');
            }
        });
    } catch (err) {
        res.status(500).send('Error sending email');
    }
};



exports.getPaginateProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    console.log(req.query.page, "page")

    try {
        const { products, totalPages, currentPage, totalProducts } = await dburl.getPaginatedUsers(page, limit);
        return res.status(200).json({
            products,
            totalPages,
            currentPage,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}



