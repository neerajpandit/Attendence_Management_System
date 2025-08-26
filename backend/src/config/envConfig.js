import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  HOST: "0.0.0.0",
  IS_SSL: process.env.IS_SSL === "true",
  HTTP_PORT: process.env.httpPORT || 8000,
  HTTPS_PORT: process.env.httpsPORT || 8443,
  SSL_KEY: process.env.SSL_SERVER_KEY,
  SSL_CERT: process.env.SSL_SERVER_CERT,
  SSL_PASSPHRASE: process.env.SSL_PASSPHRASE || "neeraj",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  isProduction: process.env.NODE_ENV === "",
  isDevelopment: process.env.NODE_ENV === "development",


  RAZORPAY_KEY_ID:"your_key_id",
  RAZORPAY_KEY_SECRET:"your_key_secret",
  RAZORPAY_WEBHOOK_SECRET:"your_webhook_secret",
  JWT_SECRET:"your_jwt_secret"
};
