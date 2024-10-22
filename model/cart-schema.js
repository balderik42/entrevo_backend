import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to the Product model
  name: { type: String },  // Add the product name
  shortName: { type: String },  // Add the shortName field
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }, // Add the image field
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [productSchema],
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
