// models/Order.js

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String, // Add this field to store the username
    required: true
  },
  orders: [
    {
      products: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
          quantity: { type: Number, required: true },
          price: { type: Number, required: true },
          image: { type: String, required: true }
        }
      ],
      address: {
        name: String,
        address: String,
        district: String,
        state: String,
        pinNumber: Number,
        phoneNumber: Number
      },
      totalPrice: { type: Number, required: true },
      status: { type: String, default: 'Pending' },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;

