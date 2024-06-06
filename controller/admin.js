const { Admin } = require('../models/adminModel');
const Productdb = require('../models/productModel.js');
const CategoryDb = require('../models/categoriesModel.js');
const { users } = require('../models/usr');
const Sale = require('../models/salesModel.js');

let jwt = require('jsonwebtoken');
let seckey = 'seckey';
require('dotenv').config();



exports.adminhanlder = async (req, res) => {
  try {
    const { firstName, lastName, email, password, canAddProduct, canDeleteProduct, canAddCategory, canDeleteCategory } = req.body;

    if (!firstName || !lastName || !email || !password) return res.status(401).json({ message: "Mondatory fields are required" });

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'An admin with this email already exists' });
    }

    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password,
      canAddProduct,
      canDeleteProduct,
      canAddCategory,
      canDeleteCategory
    });
    const savedAdmin = await newAdmin.save();

    return res.status(201).json(savedAdmin);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


exports.DeleteAdminHandler = async (req, res) => {
  try {
    const adminId = req.params.id;
    if (!adminId) res.status(401).json({ message: "id Not found" });


    const existingAdmin = await Admin.findById(adminId);
    if (!existingAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Delete the admin from the database
    await Admin.findByIdAndDelete(adminId);

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editAdminHandler = async (req, res) => {
  try {
    const adminId = req.params.id;
    const { firstName, lastName, email, canAddProduct, canDeleteProduct, canAddCategory, canDeleteCategory, profilePhoto } = req.body;
    if (!firstName || !lastName || !email) res.status(401).json({ message: "Mondatory fields are required" });


    let existingAdmin = await Admin.findById(adminId);
    if (!existingAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update the admin properties
    existingAdmin.firstName = firstName;
    existingAdmin.lastName = lastName;
    existingAdmin.email = email;
    existingAdmin.canAddProduct = canAddProduct;
    existingAdmin.canDeleteProduct = canDeleteProduct;
    existingAdmin.canAddCategory = canAddCategory;
    existingAdmin.canDeleteCategory = canDeleteCategory;
    existingAdmin.profilePhoto = profilePhoto;

    // Save the updated admin to the database
    const updatedAdmin = await existingAdmin.save();

    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAlladminsHandler = async (req, res) => {
  try {
    const admins = await Admin.find();

    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: 'No admins found' });
    }

    res.status(200).json(admins);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.adminLoginhandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !req.body.password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'user not found' });
    }
    const isPasswordValid = admin.password === req.body.password
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    const token = jwt.sign({ email: email }, seckey);
    const { password, ...userWithoutPassword } = admin;

    res.status(200).json({ token, messsage: "User has been successfully loggedIn", user: userWithoutPassword._doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAdminHandler = async (req, res) => {
  try {
    const email = req.email;
    if (!email) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'user not found' });
    }

    const { password, ...userWithoutPassword } = admin._doc;

    console.log(userWithoutPassword, 'userWithoutPassword')
    return res.status(200).json({ messsage: "User found", user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.superAdminLoginhandler = async (req, res) => {
  try {
    let AdminEmail = process.env.AdminEmail;
    let Adminpassword = process.env.adminpassord

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const admin = AdminEmail === email
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = Adminpassword === password
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    const token = jwt.sign({ email: email }, seckey);

    // Send the token in the response
    res.status(200).json({ token, messsage: "User has been successfully loggedIn" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


getOverallProfit = async () => {
  try {
    const sales = await Sale.find();
    const overallProfit = sales.reduce((total, sale) => {
      const saleProfit = sale.products.reduce((productTotal, product) => {
        const effectivePrice = product.discountPrice !== null && product.discountPrice !== undefined ? product.discountPrice : product.price;
        const profit = (effectivePrice - product.purchasePrice) * product.count;
        return productTotal + profit;
      }, 0);
      return total + saleProfit;
    }, 0);

    return overallProfit;
  } catch (error) {
    console.error("Error calculating overall profit:", error.message);
    throw new Error(error.message)

  }
};

exports.geRecords = async (req, res) => {
  try {
    console.log('function is workking')

    const totalAdmins = await Admin.countDocuments();
    const totalProducts = await Productdb.countDocuments();
    const totalCategories = await CategoryDb.countDocuments();
    const totalUsers = await users.countDocuments();
    const totalProfit = await getOverallProfit()


    return res.status(200).json({ totalAdmins, totalProducts, totalCategories, totalUsers,totalProfit });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.recordSale = async (req, res) => {
  const { username, usermail, userAddress, products } = req.body;

  try {
    let sale = await Sale.findOne({ usermail });

    const saleProducts = await Promise.all(products.map(async (item) => {
      const product = await Productdb.findById(item.id);
      if (!product) {
        throw new Error(`Product with ID ${item.products} not found`);
      }
      return {
        product_id: product._id,
        name: item.name,
        price: item.price,
        discountPrice: item.discountPrice,
        colorName: item.colorName,
        count: item.count,
        totalPrice: item.totalPrice,
        purchasePrice: item.purchasePrice 

      };
    }));

    if (sale) {
      // User exists, update their products
      sale.products = sale.products.concat(saleProducts);
      sale.date = Date.now();
    } else {
      // User does not exist, create a new document
      sale = new Sale({
        username,
        usermail,
        userAddress,
        products: saleProducts
      });
    }

    await sale.save();

   return  res.status(201).json(sale);
  } catch (error) {

    console.log(error, "error")
    return res.status(500).json({ message: error.message });
  }
};




