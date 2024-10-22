
import Cart from "../model/cart-schema.js";
import Product from "../model/product-schema.js";
import Order from "../model/order-schema.js";

export const addToCart = async (req, res) => {
  const { userId, productId, quantity, name, shortName, image } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!cart) {
      // If no cart exists for the user, create a new cart
      cart = new Cart({
        userId,
        products: [
          {
            productId,
            name: name || product.name, // Ensure name is being saved
            shortName: shortName || product.shortName, // Ensure shortName is being saved
            price: product.sellingPrice,
            quantity,
            image,
          },
        ],
      });
    } else {
      // Check if the product already exists in the cart
      const existingProduct = cart.products.find(p => p.productId.toString() === productId);

      if (existingProduct) {
        // If the product exists, update the quantity
        existingProduct.quantity += quantity;
      } else {
        // If the product doesn't exist, add it to the cart
        cart.products.push({
          productId,
          name: name || product.name,
          shortName: shortName || product.shortName, // Add shortName to the product in cart
          price: product.sellingPrice,
          quantity,
          image,
        });
      }
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCartPage = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the cart for the user by userId
    const cart = await Cart.findOne({ userId }).populate('products.productId'); // Assuming 'productId' is a reference to Product model

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const increaseProduct = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    const product = cart.products.find(p => p._id.toString() === productId);
    if (product) {
      product.quantity = quantity;
      await cart.save();
      res.status(200).json({ message: 'Quantity updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating quantity', error });
  }
}

export const deleteCartProduct = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    cart.products = cart.products.filter(p => p._id.toString() !== productId);
    await cart.save();
    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product', error });
  }
}

// controllers/orderController.js

export const placeOrder = async (req, res) => {
  try {
    const { userId, userName, cartProducts, address } = req.body;
    console.log("Order Request Body:", req.body); // Debugging

    const totalPrice = cartProducts.reduce((total, item) => total + item.price * item.quantity, 0);
    let existingOrder = await Order.findOne({ user: userId });

    const newOrder = {
      products: cartProducts.map((product) => ({
        product: product.product,
        quantity: product.quantity,
        price: product.price,
        image: product.image,
      })),
      address: {
        name: address.name,
        address: address.address,
        district: address.district,
        state: address.state,
        pinNumber: address.pinNumber,
        phoneNumber: address.phoneNumber,
      },
      totalPrice,
    };

    if (!existingOrder) {
      existingOrder = new Order({
        user: userId,
        userName,
        orders: [newOrder],
      });
      console.log("Saving new order...");
      await existingOrder.save();
    } else {
      existingOrder.orders.push(newOrder);
      console.log("Updating existing order...");
      await existingOrder.save();
    }

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error });
  } 
};


export const deleteCart = async (req, res) => {
  const { userId } = req.params;
  console.log('Deleting cart for userId:', userId); // Log the userId

  try {
    const result = await Cart.deleteOne({ userId }); // Change user to userId
    console.log('Delete result:', result); // Log the result of delete operation
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart', error });
  }
};


export const listOrders = async (req, res) => {
  console.log("Fetching orders for user:", req.params.userId); // Log the user ID
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('orders.products._id'); 
    console.log("Orders found:", orders); // Log the orders found
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const AdminlistOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    res.json(orders); // Return the orders as JSON
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const AdminUpdateStatus =  async (req, res) => {
  const { id } = req.params; // Nested order _id
  const { status } = req.body; // New status from frontend

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { "orders._id": id }, // Find the document containing the nested order by ID
      { $set: { "orders.$.status": status } }, // Use positional operator to update status
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
