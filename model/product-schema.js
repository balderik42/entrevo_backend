import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  shortName: String,
  longName: String,
  category: String,
  price: Number,
  sellingPrice: Number,
  description: String,
  image: String,
  stock: String
});

// Define and export the Product model
const Product = mongoose.model('Product', productSchema);

export default Product;

