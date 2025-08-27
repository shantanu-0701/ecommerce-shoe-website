const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  image: Buffer,
  name: {
    type: String,
    default: 'Unnamed Product'
  },
  price: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  bgcolor: {
    type: String,
    default: '#f3f4f6' 
  },
  panelcolor: {
    type: String,
    default: '#ffffff' 
  },
  textcolor: {
    type: String,
    default: '#1f2937' 
  }
});

module.exports = mongoose.model('product', productSchema);
