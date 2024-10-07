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
    }
  },
  hoverImageUrl: {
    public_id: {
      type: String,
    },
    imageUrl: {
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
  purchasePrice: {
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
    }
  }],
  discountPrice: {
    type: Number,
  },

  colors: [{
    colorName: {
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
  starRating: {
    type: String,

  },
  reviews: {
    type: String,

  },
  code: {
    type: String,
    require: true,
    unique: true

  },
  totalStockQuantity: {
    type: Number,
  },
  variantStockQuantities: [{
    variant: {
      type: String,
    },
    quantity: {
      type: Number,
    }
  }],

  sizes: [{
    sizesDetails: {
      type: String,
    }
  }],
  Meta_Title: {
    type: String,
  },
  Meta_Description: {
    type: String,
  },
  URL: {
    type: String,
  },
  Canonical_Tag: {
    type: String,
  },
  Images_Alt_Text: {
    type: String,
  },
  Og_title: {
    type: String,
  },
  Og_Image: {
    type: String,
  },
  
  Og_Url: {
    type: String,
  },
  

  




});


const Productdb = mongoose.model('Product', productSchema);

module.exports = Productdb;
