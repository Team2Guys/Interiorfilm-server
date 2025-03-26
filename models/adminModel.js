const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

const adminSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    canAddProduct: {
        type: Boolean,
        default: false
    },
    canEditProduct: {
        type: Boolean,
        default: false
    },
    canDeleteProduct: {
        type: Boolean,
        default: false
    },
    canAddCategory: {
        type: Boolean,
        default: false
    },
    canDeleteCategory: {
        type: Boolean,
        default: false
    },
    canEditCategory: {
        type: Boolean,
        default: false
    },

    canCheckProfit: {
        type: Boolean,
        default: false
    },
    canCheckRevenue: {
        type: Boolean,
        default: false
    },
    canCheckVisitors: {
        type: Boolean,
        default: false
    }, 
     canViewUsers: {
        type: Boolean,
        default: false
    },
    canViewSales: {
        type: Boolean,
        default: false
    },
    canVeiwAdmins: {
        type: Boolean,
        default: false
    },
    canVeiwTotalproducts: {
        type: Boolean,
        default: false
    },
    canVeiwTotalCategories: {
        type: Boolean,
        default: false
    },
    profilePhoto: {
        public_id: {
          type: String,
        },
        imageUrl: {
          type: String,
        }
      },
    role:{
    type:String,
    default:'Admin'
    },
  
});


adminSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) {
      return next();
    }
    try {
        const saltRounds = 10;

      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });




  
const Admin = mongoose.model("Admins", adminSchema);

module.exports = { Admin };
