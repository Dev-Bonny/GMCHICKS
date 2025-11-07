// routes/cart.js
//
// 💡 This is a brand new file you need to create
//
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const mongoose = require('mongoose');

// A helper function to get the populated cart
const getPopulatedCart = async (userId) => {
  const user = await User.findById(userId)
    .populate({
      path: 'cart.product',
      model: 'Product' // Make sure this matches your Product model name
    });
  return user.cart;
};

// A helper to re-format the cart for the frontend
const formatCart = (cart) => {
  return cart.map(item => ({
    ...(item.product._doc || item.product), // Spread the full product object
    quantity: item.quantity
  }));
};

// @route   POST /api/cart
// @desc    Add/update item in cart
// @access  Private
router.post('/', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }

  try {
    const user = await User.findById(userId);
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      user.cart[existingItemIndex].quantity = quantity;
    } else {
      // Add new item
      user.cart.push({ product: new mongoose.Types.ObjectId(productId), quantity });
    }

    await user.save();
    
    // Get the populated cart to return
    const populatedCart = await getPopulatedCart(userId);
    res.json(formatCart(populatedCart));

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { cart: { product: new mongoose.Types.ObjectId(productId) } }
    });
    
    const populatedCart = await getPopulatedCart(userId);
    res.json(formatCart(populatedCart));

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cart/clear
// @desc    Clear the entire cart
// @access  Private
router.put('/clear', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json([]); // Return an empty array
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;