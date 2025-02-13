const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description:{
    type:String
  },
  posterImageUrl: {
    public_id: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
  Meta_Title: {
    type: String,
  },
  Meta_Description: {
    type: String,
  },
  Canonical_Tag: {
    type: String,
  },

});

const CategoryDb = mongoose.model('Category', categorySchema);

module.exports = CategoryDb;
