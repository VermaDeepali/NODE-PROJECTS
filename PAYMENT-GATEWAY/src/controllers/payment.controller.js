import crypto from 'crypto';

import { createRazorpayOrder }
from '../services/payment.service.js';

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order =
      await createRazorpayOrder(amount);

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const generatedSignature = crypto
      .createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id +
        "|" +
        razorpay_payment_id
      )
      .digest('hex');

    const isAuthentic =
      generatedSignature ===
      razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};