import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const orderId = 'order_T13DbCfaopW4jm';
const paymentId = 'pay_test_12345';
const secret = process.env.RAZORPAY_KEY_SECRET;

const signature = crypto
  .createHmac('sha256', secret)
  .update(orderId + "|" + paymentId)
  .digest('hex');

console.log(signature);