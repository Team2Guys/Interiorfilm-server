const Adds_products = require('../models/add');


exports.addProduct = async (req, res) => {
    try {
        const name = req.body.name
        const code = req.body.code;

        console.log(code, "code", "name", name)
        if (!name || !code) return res.status(400).json({
            error: "Product name or code not found",
        })
        let totalQuntity = req.body.totalStockQuantity
        let existingProduct = await Adds_products.findOne({ $or: [{ name: name }, { code: code }] });

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
        const newProduct = new Adds_products(req.body)
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
        let products = await Adds_products.find();
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
        let products = await Adds_products.findByIdAndDelete(productId);
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


exports.edit_productHanler = async (req, res) => {
    const productId = req.params.id;
    const updateData = req.body;

    try {
        const updatedProduct = await Adds_products.findByIdAndUpdate(productId, updateData, { new: true });

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
        let product = await Adds_products.findById(productId);
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