// import winston from 'winston';
// import path from 'path';
// import fs from 'fs';

// // Cache for user-specific loggers
// const userLoggers = new Map();

// // Ensure logs directory exists
// const logsDir = path.join(__dirname, 'logs');
// try {
//     if (!fs.existsSync(logsDir)) {
//         fs.mkdirSync(logsDir);
//         console.log('Logs directory created:', logsDir);
//     }
// } catch (error) {
//     console.error('Failed to create logs directory:', error.message);
// }

// // Custom format to add separator line
// const separatorFormat = winston.format.printf(({ message, timestamp, ...rest }) => {
//     const logEntry = JSON.stringify({ timestamp, message, ...rest });
//     return `${logEntry}\n-------------------------------`;
// });

// // Configure Winston logger for success and error logs
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.combine(
//         winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//         separatorFormat // Use custom format with separator
//     ),
//     transports: [
//         new winston.transports.File({
//             filename: path.join(logsDir, 'success.log'),
//             level: 'info',
//             handleExceptions: true
//         }),
//         new winston.transports.File({
//             filename: path.join(logsDir, 'error.log'),
//             level: 'error',
//             handleExceptions: true
//         }),
//         new winston.transports.Console({
//             format: winston.format.simple()
//         })
//     ]
// });

// // Function to create or get user-specific logger
// const getUserLogger = (userId) => {
//     const sanitizedUserId = userId.replace(/[^a-zA-Z0-9-_]/g, '_');
//     const userLogFile = path.join(logsDir, `${sanitizedUserId}_log.txt`);

//     if (userLoggers.has(sanitizedUserId)) {
//         console.log(`Reusing existing logger for user ${sanitizedUserId}: ${userLogFile}`);
//         return userLoggers.get(sanitizedUserId);
//     }

//     try {
//         const userLogger = winston.createLogger({
//             level: 'info',
//             format: winston.format.combine(
//                 winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//                 separatorFormat // Use custom format with separator
//             ),
//             transports: [
//                 new winston.transports.File({
//                     filename: userLogFile,
//                     handleExceptions: true,
//                     flags: 'a'
//                 })
//             ]
//         });

//         userLoggers.set(sanitizedUserId, userLogger);
//         console.log(`Created new logger for user ${sanitizedUserId}: ${userLogFile}`);
//         return userLogger;
//     } catch (error) {
//         console.error(`Failed to create logger for user ${sanitizedUserId}:`, error.message);
//         return logger;
//     }
// };

// // Reusable logging function for controllers
// const logActivity = (req, res, controllerName, action,userId, additionalData = {}) => {
//     // const userId = req.user?.id ?? req.body?.userId ?? 'anonymous';
//     const ip = req.ip ?? req.connection?.remoteAddress ?? 'unknown';
//     const method = req.method;
//     const url = req.originalUrl;
//     const status = res.statusCode;

//     const logData = {
//         controller: controllerName,
//         action,
//         userId,
//         ip,
//         method,
//         url,
//         status,
//         request: {
//             headers: req.headers,
//             body: { ...req.body, password: 'REDACTED' },
//             params: req.params,
//             query: req.query
//         },
//         response: {
//             status
//         },
//         ...additionalData
//     };

//     try {
//         if (status >= 400) {
//             logger.error(logData);
//         } else {
//             logger.info(logData);
//         }

//         const userLogger = getUserLogger(userId);
//         userLogger.info(logData);
//     } catch (error) {
//         console.error('Logging failed:', error.message, logData);
//     }
// };

// export { logActivity };








import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Cache for user-specific loggers
const userLoggers = new Map();

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
try {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
        console.log('Logs directory created:', logsDir);
    }
} catch (error) {
    console.error('Failed to create logs directory:', error.message);
}

// Custom format to display logData with each key-value pair on a new line
const separatorFormat = winston.format.printf(({ message, timestamp, ...rest }) => {
    const logData = { timestamp, message, ...rest };
    // Format logData with each key-value pair on a new line
    const formattedLog = Object.entries(logData)
        .map(([key, value]) => {
            // Stringify nested objects with indentation for readability
            if (typeof value === 'object' && value !== null) {
                return `"${key}": ${JSON.stringify(value, null, 2).replace(/\n/g, '\n  ')}`;
            }
            return `"${key}": ${JSON.stringify(value)}`;
        })
        .join(',\n');
    // Wrap in curly braces to maintain JSON structure
    const logEntry = `{\n${formattedLog}\n}`;
    return `${logEntry}\n-------------------------------`;
});

// Configure Winston logger for success and error logs
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        separatorFormat
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logsDir, 'success.log'),
            level: 'info',
            handleExceptions: true
        }),
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            handleExceptions: true
        }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// Function to create or get user-specific logger
const getUserLogger = (userId) => {
    const sanitizedUserId = userId.replace(/[^a-zA-Z0-9-_]/g, '_');
    const userLogFile = path.join(logsDir, `${sanitizedUserId}.log`);

    if (userLoggers.has(sanitizedUserId)) {
        console.log(`Reusing existing logger for user ${sanitizedUserId}: ${userLogFile}`);
        return userLoggers.get(sanitizedUserId);
    }

    try {
        const userLogger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                separatorFormat
            ),
            transports: [
                new winston.transports.File({
                    filename: userLogFile,
                    handleExceptions: true,
                    flags: 'a'
                })
            ]
        });

        userLoggers.set(sanitizedUserId, userLogger);
        console.log(`Created new logger for user ${sanitizedUserId}: ${userLogFile}`);
        return userLogger;
    } catch (error) {
        console.error(`Failed to create logger for user ${sanitizedUserId}:`, error.message);
        return logger;
    }
};

// Reusable logging function for controllers
const logActivity = (req, res, controllerName, action, userId, additionalData = {}) => {
    const ip = req.ip ?? req.connection?.remoteAddress ?? 'unknown';
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;

    const logData = {
        controller: controllerName,
        action,
        userId,
        ip,
        method,
        url,
        status,
        request: {
            // headers: req.headers,
            body: { ...req.body, password: 'REDACTED' },
            params: req.params,
            query: req.query
        },
        response: {
            status
        },
        ...additionalData
    };

    try {
        if (status >= 400) {
            logger.error(logData);
        } else {
            logger.info(logData);
        }

        const userLogger = getUserLogger(userId);
        userLogger.info(logData);
    } catch (error) {
        console.error('Logging failed:', error.message, logData);
    }
};

export { logActivity };













import morgan from "morgan";
// import fs from "fs";
// import path from "path";
import moment from "moment-timezone";

import { __dirname,__filename, UPLOAD_DIR_LOGS } from "../config/constants.js";


const logDirectory = path.join(UPLOAD_DIR_LOGS);
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

const getLogStream = fs.createWriteStream(path.join(logDirectory, "GET.log"), {
  flags: "a",
});
const postLogStream = fs.createWriteStream(
  path.join(logDirectory, "POST.log"),
  { flags: "a" }
);
const putLogStream = fs.createWriteStream(path.join(logDirectory, "PUT.log"), {
  flags: "a",
});
const deleteLogStream = fs.createWriteStream(
  path.join(logDirectory, "DELETE.log"),
  { flags: "a" }
);

// Custom function to log request and response bodies
const logRequestBody = (req) => {
  if (req.body) {
    return JSON.stringify(req.body); // Log request body if available
  }
  return "No Body"; // If no body, just return a message
};

// Custom function to format logs
const customMorganFormat = (tokens, req, res) => {
  const status = tokens.status(req, res);
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const responseTime = tokens["response-time"](req, res);

  // Get the current time in IST using moment-timezone
  const date = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"); // Format in IST

  const userAgent = req.get("User-Agent") || "unknown";
  const ip = req.ip || "unknown";

  const requestBody = logRequestBody(req); // Get request body
  let responseBody = ""; // Initialize response body as empty string

  // Capture the response body after the request is processed
  const oldWrite = res.write;
  const oldEnd = res.end;
  const chunks = [];

  res.write = (...args) => {
    chunks.push(Buffer.from(args[0]));
    oldWrite.apply(res, args);
  };

  res.end = (...args) => {
    if (args[0]) {
      chunks.push(Buffer.from(args[0]));
    }
    const body = Buffer.concat(chunks).toString("utf8");
    responseBody = body; // Capture the response body
    oldEnd.apply(res, args);
  };

  let logMessage =
    `[${date}] ${method} ${url} ${status} - IP: ${ip} User-Agent: ${userAgent} - ${responseTime}ms\n` +
    `Request Body: ${requestBody}\n` +
    `Response Body: ${responseBody}`;

  // Check if the request passed or failed
  if (status >= 200 && status < 300) {
    logMessage += " - Pass";
  } else {
    logMessage += " - Fail";
  }

  return logMessage;
};

// Custom logging function to separate by HTTP method
function setupLogger(app) {
  // In production: Use "combined" format for each HTTP method and log to the appropriate file
  app.use((req, res, next) => {
    const method = req.method;
    let logStream = null;

    switch (method) {
      case "GET":
        logStream = getLogStream;
        break;
      case "POST":
        logStream = postLogStream;
        break;
      case "PUT":
        logStream = putLogStream;
        break;
      case "DELETE":
        logStream = deleteLogStream;
        break;
      default:
        logStream = null;
    }

    if (logStream) {
      // Use the custom format with request and response body logging
      morgan(customMorganFormat, { stream: logStream })(req, res, next);
    } else {
      next(); // Proceed if no matching log stream for the method
    }
  });

  // In development: Use the custom format (with body logging)
  if (process.env.NODE_ENV !== "production") {
    app.use(morgan(customMorganFormat));
  }
}

export default setupLogger;



