const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  posterImageUrl: {
    public_id: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    altText: {
      type: String,
    }
  },
  hoverImageUrl: {
    public_id: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    altText: {
      type: String,
    }
  },
  description: {
    type: String,
    required: true
  },
  salePrice: {
    type: Number,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  imageUrl: [{
    imageIndex: {
      type: Number,
      required: false
    },
    public_id: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    altText: {
      type: String,
    }
  }],

  modelDetails: [{
    name: {
      type: String,
    },
    detail: {
      type: String,
    }
  }],
  spacification: [{
    specsDetails: {
      type: String,
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  code: {
    type: String,
    require: true,
    unique: true

  },
  totalStockQuantity: {
    type: Number,
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


const Adds_products = mongoose.model('Adds_products', productSchema);

module.exports = Adds_products;
