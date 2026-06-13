# Run Project Locally

## 1. Clone Repository

```bash
git clone <repository-url>
```

---

## 2. Navigate to Project

```bash
cd payment-gateway
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Install Nodemon

```bash
npm install -D nodemon
```

---

## 5. Create `.env` File

Add the following:

```env
RAZORPAY_KEY_ID=your_test_key
RAZORPAY_KEY_SECRET=your_test_secret
```

---

## 6. Start Backend Server

```bash
npm run dev
```

Expected output:

```txt
Server running on 5000
```

---

## 7. Run Frontend

Open frontend folder and run:

```bash
npx serve .
```

OR use VSCode Live Server.

---

## 8. Open Frontend in Browser

Example:

```txt
http://localhost:3000
```

---

## 9. Test Payment

Use Razorpay test card:

```txt
4111 1111 1111 1111
```

Use:

* Any future expiry
* Any CVV
* Any OTP



# payment-gateway structure

.
├── package-lock.json
├── package.json
├── README.md
└── src
    ├── app.js
    ├── config
    │   └── razorpay.js
    ├── controllers
    │   └── payment.controller.js
    ├── routes
    │   └── payment.routes.js
    ├── server.js
    └── services
        └── payment.service.js


