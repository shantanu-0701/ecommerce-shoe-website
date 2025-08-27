const express = require('express');
const isLoggedin = require('../middlewares/isLoggedin');
const router = express.Router();
const productModel = require('../models/productmodel');
const userModel = require('../models/usermodel');

router.get('/', (req, res) => {
  res.render('index');
});

router.get("/shop", isLoggedin, async (req, res) => {
    let allProducts = await productModel.find();
    let products = allProducts.map(product => ({
        ...product.toObject(), 
        image: product.image ? `data:image/jpeg;base64,${product.image.toString('base64')}` : null
    }));

    res.render("shop", { products }); 
});


router.get('/about', (req, res) => {
  res.render('about'); 
});

router.get('/addtocart/:id', isLoggedin, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.id);
  await user.save();
  req.flash('success', 'Added to cart successfully!!');
  res.redirect('/shop');
});

router.get('/cart', isLoggedin, async (req, res) => {
  try {
    // Get user and populate cart items
    const user = await userModel.findOne({ email: req.user.email }).populate('cart');

    if (!user || !user.cart) {
      return res.render('cart', {
        cartItems: [],
        totalMRP: 0,
        totalDiscount: 0,
        finalAmount: 0
      });
    }

    // Calculate totals
    const cartItems = user.cart.map(product => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount || 0,
      image: product.image ? `data:image/jpeg;base64,${product.image.toString('base64')}` : null
    }));

    const totalMRP = cartItems.reduce((acc, item) => acc + item.price, 0);
    const totalDiscount = cartItems.reduce((acc, item) => acc + (item.discount || 0), 0);
    const platformFee = 0;
    const shippingFee = 0;

    const finalAmount = totalMRP - totalDiscount + platformFee + shippingFee;

    res.render('cart', {
      cartItems,
      totalMRP,
      totalDiscount,
      platformFee,
      shippingFee,
      finalAmount
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


// GET route to display the checkout page
router.get('/checkout', isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).populate('cart');
    res.render('checkout', { user }); 
  } catch (err) {
    console.error(err);
    res.redirect('/shop');
  }
});

// POST route to handle the checkout form submission
router.post('/checkout', isLoggedin, async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        user.cart = []; // Clear the cart
        await user.save();

        req.flash('success', 'Your order has been placed successfully!');
        res.redirect('/shop');

    } catch (err) {
        console.error(err);
        req.flash('error', 'There was a problem placing your order.');
        res.redirect('/checkout');
    }
});

router.get('/removefromcart/:id', isLoggedin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    
    const itemIndex = user.cart.indexOf(req.params.id);

    if (itemIndex > -1) {
      user.cart.splice(itemIndex, 1);
    }

    await user.save();
    req.flash('success', 'Item removed from cart.');
    res.redirect('/cart');

  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not remove item from cart.');
    res.redirect('/cart');
  }
});


module.exports = router;