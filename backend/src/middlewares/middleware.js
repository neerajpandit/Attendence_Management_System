// middleware.js

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import session from 'express-session';
import winston from 'winston';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

// CORS Configuration
const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
});

// Helmet Security Headers
const helmetMiddleware = () => {
  return [
    helmet(),
    helmet.hsts({
      maxAge: 31536000, // 1 year
      includeSubDomains: true, // Apply to all subdomains
      preload: true, // Preload into browsers
    }),
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
      }
    }),
  ];
};

// Rate Limiting
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50000, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes.",
});

// CSRF Protection
const csrfProtection = csrf({ cookie: { httpOnly: true, secure: true } });

// Middleware for parsing requests
const bodyParserMiddleware = [
  express.json({ limit: process.env.EXPRESS_JSON_LIMIT || '10kb' }),
  express.urlencoded({ extended: true, limit: process.env.EXPRESS_URLENCODED_LIMIT || '10kb' }),
  cookieParser(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true })
];

// Session and Passport Setup
const sessionMiddleware = session({
  secret: process.env.ACCESS_TOKEN_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "Strict",
  },
});

// Logger Setup
const loggerMiddleware = (app) => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  }

  app.use((req, res, next) => {
    logger.info(`Request made to: ${req.originalUrl}`);
    next();
  });
};

export {
  corsMiddleware,
  helmetMiddleware,
  rateLimiter,
  csrfProtection,
  bodyParserMiddleware,
  sessionMiddleware,
  loggerMiddleware,
};
