const Products = require('../models/productModel'); // adjust the path as necessary

const getPaginatedUsers = async (page, limit) => {
  try {
    const products = await Products.find()
      .skip((page - 1) * limit)
      .limit(limit) 
      .exec(); 
    const count = await Products.countDocuments();

    return {
    products,
      totalPages: Math.ceil(count / limit), 
      currentPage: page,
    };
  } catch (error) {
    throw new Error('Error fetching paginated users: ' + error.message);
  }
};


module.exports = {
    getPaginatedUsers
  
  };
