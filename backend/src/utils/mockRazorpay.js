// utils/mockRazorpay.js

export const mockRazorpay = {
  orders: {
    create: async (options) => {
      return {
        id: `order_mock_${Date.now()}`,
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: "created",
      };
    },
  },
  payments: {
    fetch: async (paymentId) => {
      return {
        id: paymentId,
        amount: 50000, // ₹500.00
        currency: "INR",
        status: "captured",
        method: "CARD",
      };
    },
  },
};
export const mockRazorpayInstance = {
  orders: mockRazorpay.orders,
  payments: mockRazorpay.payments,
};
export const mockRazorpayKey = process.env.RAZORPAY_KEY_ID || "mock_key_id";