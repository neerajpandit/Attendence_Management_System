

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";

import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import multer from "multer";
import fs from "fs";
import rateLimit from "express-rate-limit";
import csurf from "csurf"; // Keep only csurf
import winston from "winston";
import sanitizeHtml from "sanitize-html";
import xssClean from "xss-clean";
import compression from "compression";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import setupLogger from "./utils/logger.js";
import {
  EXPRESS_JSON_LIMIT,
  EXPRESS_URLENCODED_LIMIT,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_MESSAGE,
  RATE_LIMIT_WINDOW_MS,
  UPLOAD_DIR_IMAGES,
  __dirname,
} from "./config/constants.js";
import { ENV } from "./config/envConfig.js";
import authRouter from "./routes/authRoutes.js";
import superAdminRouter from "./routes/superAdminRoutes.js";
import organizationRouter from "./routes/organizationRoutes.js";

dotenv.config();
const app = express();

// Logger

// app.use(userLoggerMiddleware);
const logger = setupLogger(app);

// Security Flags
const securityFlags = {
  useHelmet: true,
  useRateLimit: true,
  useCSRF: false, // Enable CSRF protection
  useMongoSanitize: true,
  useXssClean: true,
  useHPP: true,
  useCompression: true,
  debug: {
    mongoSanitize: process.env.NODE_ENV !== "production",
    xssClean: process.env.NODE_ENV !== "production",
    hpp: process.env.NODE_ENV === "production",
  },
}; 

// Middleware: Block query params on POST
const validateQueryParams = (req, res, next) => {
  if (req.method === "POST" && Object.keys(req.query).length > 0) {
    logger.warn("Unexpected query parameters in POST request", {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      query: req.query,
    });
    return res.status(400).json({
      error: {
        source: "query-validation",
        message: "Query parameters are not allowed for POST requests",
      },
    });
  }
  next();
};

// Helmet
if (securityFlags.useHelmet) {
    app.use(helmet({ xPoweredBy: false }));
    console.log("log", ...ENV.CORS_ORIGIN);

    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: [
                    "'self'",
                    "data:",
                    ...ENV.CORS_ORIGIN,
                    "http://localhost:5173",
                ],
                connectSrc: [
                    "'self'",
                    ...ENV.CORS_ORIGIN,
                    "http://localhost:5173",
                ],
                fontSrc: ["'self'"],
                frameAncestors: ["'none'"],
                upgradeInsecureRequests: ENV.isProduction ? [] : null,
            },
            reportOnly: process.env.NODE_ENV !== "production",
            reportUri: "/api/v1/csp-report",
        })
    );
}

// Rate Limiting
if (securityFlags.useRateLimit) {
    const limiter = rateLimit({
        windowMs: RATE_LIMIT_WINDOW_MS,
        max: RATE_LIMIT_MAX_REQUESTS,
        message: RATE_LIMIT_MESSAGE,
        handler: (req, res, next) => {
            const error = new Error(RATE_LIMIT_MESSAGE);
            error.status = 429;
            error.source = "rate-limit";
            next(error);
        },
    });
    app.use(limiter);
}

// Trust proxy
app.set("trust proxy", 1);

// CORS
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Your React frontend URL
//     credentials: true, // Allow cookies
//   })
// );
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
console.log("Allowed Origins:", allowedOrigins);

app.use(
    cors({
        origin: function (origin, callback) {
            callback(null, true);
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-CSRF-Token",
            "x-signature",
        ],
        credentials: true,
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-CSRF-Token, x-signature"
    );
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// Parsers
app.use(express.json({ limit: EXPRESS_JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: EXPRESS_URLENCODED_LIMIT }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    secret: process.env.ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: ENV.isProduction,
      sameSite: "strict",
    },
  })
);

// CSRF Protection
if (securityFlags.useCSRF) {
  const csrfProtection = csurf({
    cookie: {
      httpOnly: true,
      secure: ENV.isProduction,
      sameSite: "strict",
    },
  });

  // Route to get CSRF token (no CSRF protection on this route)
  app.get("/api/v1/csrf-token", csrfProtection, (req, res) => {
    const token = req.csrfToken();
    res.cookie("XSRF-TOKEN", token, {
      httpOnly: false, // Allow frontend to read the cookie
      secure: ENV.isProduction,
      sameSite: "strict",
    });
    res.json({ csrfToken: token });
  });

  // Apply CSRF protection to all POST, PUT, DELETE routes
  app.use(csrfProtection);
}

// Compression
if (securityFlags.useCompression) {
  app.use(compression());
}

// HTML sanitization
app.use((req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],
          allowedAttributes: {},
        });
      }
    }
  }
  next();
});

// HTTPS Redirect
app.use((req, res, next) => {
  if (ENV.isProduction && req.protocol === "http") {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// Static file routes
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use("/logs", express.static(path.join(__dirname, "public", "logs")));

app.get("/images/:filename", (req, res) => {
  const file = path.join(UPLOAD_DIR_IMAGES, req.params.filename);
  if (!file.startsWith(UPLOAD_DIR_IMAGES)) {
    return res.status(403).send("Forbidden: Invalid file path.");
  }
  fs.existsSync(file)
    ? res.sendFile(file)
    : res.status(404).send("Image not found");
});



// CSP violation report
app.post("/api/v1/csp-report", express.json(), (req, res) => {
  logger.warn("CSP Violation Reported", {
    ip: req.ip,
    url: req.originalUrl,
    report: req.body,
  });
  res.status(204).send();
});

// Routes
app.get("/api/v1/", (_, res) =>
  res.json({ message: "Welcome to the Node.js server!" })
);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/superadmin",superAdminRouter)
app.use("/api/v1/organization",organizationRouter );


// 404
app.use("/", (_, res) => res.status(404).send("<h1>404! Page not found</h1>"));

// Error Handling
app.use((err, req, res, next) => {
  const errorDetails = {
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params,
    stack: err.stack,
  };

  let status = err.status || 500;
  let source = err.source || "unknown";
  let message = err.message || "Internal Server Error";

  if (err.type === "entity.too.large") {
    status = 413;
    source = "body-parser";
    message = "Payload Too Large";
  } else if (err.code === "EBADCSRFTOKEN") {
    status = 403;
    source = "csurf";
    message = "Invalid CSRF Token";
  } else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    status = 400;
    source = "body-parser";
    message = "Invalid JSON";
  } else if (err instanceof multer.MulterError) {
    status = 400;
    source = "multer";
    message = `File Upload Error: ${err.message}`;
  } else if (source === "rate-limit") {
    status = 429;
    source = "rate-limit";
    message = err.message || "Too Many Requests";
  } else if (err.message.includes("Content Security Policy")) {
    status = 403;
    source = "helmet-csp";
    message = "Content Security Policy Violation";
  } else if (res.locals.sanitization?.mongo) {
    status = 400;
    source = "mongo-sanitize";
    message = "Invalid Input: Prohibited MongoDB operators detected";
  }

  res.status(status).json({
    error: {
      status,
      source,
      message,
    },
  });
});

export { app };