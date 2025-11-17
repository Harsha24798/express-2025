import { body } from "express-validator";

// Login Validation
export const loginValidate = [
    body('Username').trim().notEmpty().withMessage("Please enter Username"),
    body('Password').isStrongPassword({minLength:8}).withMessage("Please enter strong Password"),
    body('Name').notEmpty().withMessage("Please enter the Name")
];

// Register Validation
export const registerValidate = [
  body("Name").notEmpty().withMessage("Name is required"),

  body("Username")
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

  body("Password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 4 }).withMessage("Password must be at least 4 characters"),
];