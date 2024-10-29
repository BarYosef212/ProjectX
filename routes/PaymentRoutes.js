const Order = require('../models/order'); // Replace with your actual Order model
const nodemailer = require('nodemailer'); // Ensure nodemailer is installed

router.post('/checkout', async (req, res) => {
  try {
    // 1. Gather Form Data
    const { cardNumber, expiryMonth, expiryYear, cvv, cardHolderName } = req.body;

    // 2. Create Order in MongoDB
    const orderDetails = {
      cardHolderName,
      items: req.session.cart.items, // assuming cart items are stored in session
      totalAmount: req.session.cart.totalAmount, // adjust based on your cart structure
    };
    const newOrder = await Order.create(orderDetails);

    // 3. Send Confirmation Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const itemsDetails = orderDetails.items
      .map(item => `${item.name} (Quantity: ${item.quantity}) - $${item.price}`)
      .join('\n');
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: req.user.email, // assuming user email is available in req.user
      subject: 'Order Confirmation',
      text: `Thank you for your order! Order Number: ${newOrder._id}\n\nItems:\n${itemsDetails}\n\nTotal Paid: $${orderDetails.totalAmount}`,
    };

    await transporter.sendMail(mailOptions);

    // 4. Clear Cart and Show Confirmation Message
    req.session.cart = null;
    res.render('orderConfirmation', { orderId: newOrder._id });

  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).send('An error occurred while processing your order.');
  }
});
