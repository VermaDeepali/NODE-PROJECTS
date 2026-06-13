import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

import { createRazorpayOrder }
from '../services/payment.service.js';

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order =
      await createRazorpayOrder(amount);

    console.log("order", order)

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

    console.log("body>>>>>", razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature)

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
    
    console.log("generatedSignature", generatedSignature)

    const isAuthentic =
      generatedSignature ===
      razorpay_signature;

      console.log("isAuthentic", isAuthentic)

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