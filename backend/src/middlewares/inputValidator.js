// import Joi from 'joi';
// // import { log } from 'winston';

// const registrationSchema = Joi.object({
//   phoneNo: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
//     'string.base': 'Phone number must be a string.',
//     'string.pattern.base': 'Phone number must be 10 digits long.',
//     'any.required': 'Phone number is required.',
//   }),

//   email: Joi.string().email().required().messages({
//     'string.base': 'Email must be a string.',
//     'string.email': 'Please provide a valid email address.',
//     'any.required': 'Email is required.',
//   }),

//   username: Joi.string().alphanum().min(3).max(30).required().messages({
//     'string.base': 'Username must be a string.',
//     'string.alphanum': 'Username must only contain alphanumeric characters.',
//     'string.min': 'Username must be at least 3 characters long.',
//     'string.max': 'Username must be at most 30 characters long.',
//     'any.required': 'Username is required.',
//   }),

//   password: Joi.string().min(6).required().messages({
//     'string.base': 'Password must be a string.',
//     'string.min': 'Password must be at least 6 characters long.',
//     'any.required': 'Password is required.',
//   }),

//   role: Joi.string().valid('admin', 'employee', 'user').default('employee').messages({
//     'string.base': 'Role must be a string.',
//     'any.only': 'Role must be one of "admin", "employee", or "user".',
//     'any.required': 'Role is required.',
//   })
// });

// export const validateRegistration = (req, res, next) => {
//   console.log(req.body);
//   const { error } = registrationSchema.validate(req.body);

//   if (error) {
//     return res.status(400).json({
//       message: error.details[0].message,
//     });
//   }

//   next();
// };

import Joi from "joi";

import { Filter } from "bad-words";

// Initialize the BadWords filter
const badWordsFilter = new Filter();
badWordsFilter.addWords(
    "chutiye",
    "gandu",
    "bhenchod",
    "madarchod",
    "lund",
    "gandmarichod",
    "jhant",
    "behenki",
    "bhosdike",
    "chod",
    "baapka",
    "kaand",
    "kameena",
    "p***",
    "tatti",
    "ch*****",
    "bichu",
    "chikna",
    "saley",
    "saala",
    "bavla",
    "gand",
    "gandgi",
    "bakra",
    "kutte",
    "kutti",
    "patloon",
    "m****",
    "g****",
    "lauda",
    "m****h",
    "gadhha",
    "j*****",
    "baitha",
    "n****",
    "d*****",
    "kaand",
    "bhootni",
    "gali",
    "l****",
    "piss",
    "s*****",
    "f*****",
    "sh*****",
    "b*****",
    "j***",
    "s*****",
    "b*tch",
    "a*s",
    "asshole",
    "bastard",
    "cunt",
    "dick",
    "fag",
    "motherfucker",
    "prick",
    "shit",
    "twat",
    "slut",
    "whore",
    "douchebag",
    "dickhead",
    "cock",
    "fucker",
    "fucking",
    "sucker",
    "bastards",
    "cockhead",
    "dickhead",
    "bitch",
    "ass",
    "bimbo",
    "jerk",
    "whoremonger",
    "skank",
    "pussy",
    "cum"
);

// Custom validation function to check for malicious content and bad words
const validateTextInput = (value, helpers) => {
    // Regex to detect malicious script, HTML, SQL content, and MongoDB injection attempts
    const maliciousPattern =
        /<.*?script.*?>|javascript:|<.*?on[a-zA-Z]+=.*?>|<.*?style.*?>|<.*?iframe.*?>|eval\((.*?)\)|alert\((.*?)\)|<.*?object.*?>|<.*?embed.*?>|<.*?form.*?>|--|;|union|select|drop|insert|delete|update|grant|shutdown|alert\s*\(|prompt\s*\(|[{}$&]/i;

    // MongoDB-specific patterns (e.g., special characters, operators used in queries)
    const mongoDBInjectionPattern =
        /(\$gt|\$lt|\$eq|\$ne|\$in|\$nin|\$or|\$and|\$regex|\$where|\$exists|[{}$&])/i;

    // Check if value is a string and matches any of the malicious patterns
    if (
        typeof value === "string" &&
        (maliciousPattern.test(value) || mongoDBInjectionPattern.test(value))
    ) {
        return helpers.message(
            "Input contains malicious content (e.g., script tags, JavaScript, SQL injection, MongoDB injection, event handlers, etc.)."
        );
    }

    // Use the badWordsFilter to check for offensive language
    if (typeof value === "string" && badWordsFilter.isProfane(value)) {
        return helpers.message("Input contains inappropriate language.");
    }

    return value;
};


//register
const registrationSchema = Joi.object({
    phoneNo: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            "string.base": "Phone number must be a string.",
            "string.pattern.base": "Phone number must be 10 digits long.",
            "any.required": "Phone number is required.",
        })
        .custom(validateTextInput, "Phone number validation"), // Apply custom validation

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.base": "Email must be a string.",
            "string.email": "Please provide a valid email address.",
            "any.required": "Email is required.",
        })
        .custom(validateTextInput, "Email validation"), // Apply custom validation

    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.base": "Username must be a string.",
            "string.alphanum":
                "Username must only contain alphanumeric characters.",
            "string.min": "Username must be at least 3 characters long.",
            "string.max": "Username must be at most 30 characters long.",
            "any.required": "Username is required.",
        })
        .custom(validateTextInput, "Username validation"), // Apply custom validation

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.base": "Password must be a string.",
            "string.min": "Password must be at least 6 characters long.",
            "any.required": "Password is required.",
        })
        .custom(validateTextInput, "Password validation"), // Apply custom validation

    role: Joi.string()
        .valid("0", "1", "2")
        .default("employee")
        .messages({
            "string.base": "Role must be a string.",
            "any.only": 'Role must be one of "admin", "employee", or "user".',
            "any.required": "Role is required.",
        })
        .custom(validateTextInput, "Role validation"), // Apply custom validation
});

export const validateRegistration = (req, res, next) => {
    console.log(req.body);

    // Ensure that the body fields are strings before validation
    Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] !== "string") {
            req.body[key] = String(req.body[key]);
        }
    });

    // Validate request body against the Joi schema
    const { error } = registrationSchema.validate(req.body);

    if (error) {
        // If validation fails, return error message
        return res.status(400).json({
            message: error.details[0].message,
        });
    }

    // Proceed to next middleware if validation is successful
    next();
};


//login validation
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.base": "Email must be a string.",
            "string.email": "Please provide a valid email address.",
            "any.required": "Email is required.",
        })
        .custom(validateTextInput, "Email validation"),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.base": "Password must be a string.",
            "string.min": "Password must be at least 6 characters long.",
            "any.required": "Password is required.",
        })
        .custom(validateTextInput, "Password validation"),
});

// Middleware for login validation
export const validateLogin = (req, res, next) => {
    Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] !== "string") {
            req.body[key] = String(req.body[key]);
        }
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }

    next();
};

// Middleware for entity creation validation
const entitySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .custom(validateTextInput, "Name validation")
    .messages({
      "string.empty": "Name is required.",
      "string.min": "Name must be at least 2 characters.",
      "string.max": "Name can’t be longer than 100 characters.",
    }),

  email: Joi.string()
    .email()
    .required()
    .custom(validateTextInput, "Email validation")
    .messages({
      "string.email": "Invalid email address.",
      "any.required": "Email is required.",
    }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .custom(validateTextInput, "Phone validation")
    .messages({
      "string.pattern.base": "Phone must be a valid 10-digit number starting with 6-9.",
      "any.required": "Phone number is required.",
    }),

  max_institute_limit: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Max institute limit must be a number.",
      "number.min": "Max institute limit must be at least 1.",
      "any.required": "Max institute limit is required.",
    }),
    subdomain: Joi.string()
    .pattern(/^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/)
    .min(3)
    .max(50)
    .custom(validateTextInput, "Subdomain validation")
    .messages({
      "string.pattern.base": "Subdomain can only contain letters, numbers, and hyphens (3-50 chars).",
      "any.required": "Subdomain is required.",
    }),
});

// Middleware
export const validateEntity = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (typeof req.body[key] !== "string") {
      req.body[key] = String(req.body[key]);
    }
  });

  const { error } = entitySchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};