import razorpay from '../config/razorpay.js';

export const createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`
  };

  return await razorpay.orders.create(options);
};