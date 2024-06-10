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
  starRating : {
  type: String,

},
reviews : {
  type: String,
  
},
code : {
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
sizes : [{
  type: String,
}, 
]
});


const Productdb = mongoose.model('Product', productSchema);

module.exports = Productdb;
