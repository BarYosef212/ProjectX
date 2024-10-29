const Order = require('../models/order'); // Replace with your actual Order model
const nodemailer = require('nodemailer'); // Ensure nodemailer is installed

router.post('/checkout', async (req, res) => {
  try {
    // 1. Collect Payment Data
    const { cardNumber, expiryMonth, expiryYear, cvv, cardHolderName } = req.body;

    // 2. Create Order Object
    const orderDetails = {
      cardHolderName,
      items: req.session.cart.items, // assuming items are stored in session cart
      totalAmount: req.session.cart.totalAmount, // adjust based on your cart structure
    };

    // 3. Save Order in MongoDB
    const newOrder = await Order.create(orderDetails);


    // 4. Send Order Confirmation Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // replace with your email
        pass: 'your-email-password', // replace with your password or use env variables
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: req.user.email, // assuming user email is stored in req.user
      subject: 'Order Confirmation',
      text: `Thank you for your purchase! Your order number is ${newOrder._id}. Details: ${JSON.stringify(orderDetails.items)}`,
    };

    await transporter.sendMail(mailOptions);

    // 6. Clear Cart and Redirect
    req.session.cart = null;
    res.redirect('/order-confirmation'); // redirect to a confirmation page

  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).send('An error occurred while processing your order.');
  }
});

