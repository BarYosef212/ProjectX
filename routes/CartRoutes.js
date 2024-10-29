// Add item to cart
app.post('/cart/add', (req, res) => {
    const { productId, name, price, quantity } = req.body;
  
    // Initialize cart if it doesn't exist
    if (!req.session.cart) {
      req.session.cart = [];
    }
  
    // Check if item already exists in the cart
    const existingItem = req.session.cart.find(item => item.productId === productId);
  
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      req.session.cart.push({ productId, name, price, quantity });
    }
  
    res.send({ success: true, cart: req.session.cart });
  });
  
  // Get cart contents
  app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
      res.send({ message: 'Your cart is empty', cart });
    } else {
      res.send({ cart });
    }
  });
  