import { Router } from "express";
import DB from "../db/db.mjs";
import { loginValidate, registerValidate } from "../../util/validationMethod.mjs";
import { matchedData, validationResult } from "express-validator";
import { loginError } from "../../util/error-creator.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRouter = Router();

// ✅ Get all users
userRouter.get('/', async (_, res) => {
  try {
    const users = await DB.user.findMany();
    return res.status(200).json({
      msg: "User data fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error fetching users",
      error: error.message,
    });
  }
});

// ✅ Get user by ID
userRouter.get('/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const user = await DB.user.findUnique({
      where: { Id: userId },
    });

    if (!user) {
      return res.status(404).json({ msg: `User with ID ${userId} not found` });
    }

    return res.status(200).json({
      msg: `User with ID ${userId} found`,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error fetching user",
      error: error.message,
    });
  }
});

// ✅ Create new user
userRouter.post('/create-user', async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await DB.user.create({ data: userData });

    return res.status(201).json({
      msg: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error creating user",
      error: error.message,
    });
  }
});

// ✅ Update user
userRouter.put('/update-user/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const updateData = req.body;

    const updatedUser = await DB.user.update({
      where: { Id: userId },
      data: updateData,
    });

    return res.status(200).json({
      msg: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error updating user",
      error: error.message,
    });
  }
});

// ✅ Delete user
userRouter.delete('/delete-user/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id);

    await DB.user.delete({ where: { Id: userId } });

    return res.status(200).json({
      msg: `User with ID ${userId} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error deleting user",
      error: error.message,
    });
  }
});

// Login
userRouter.post('/login', loginValidate, async (req, res) => {
  try {
    // 1️⃣ Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedError = loginError(errors.array());
      return res.status(400).json({
        msg: "Validation failed",
        errors: formattedError,
      });
    }

    // 2️⃣ Clean data
    const { Username, Password } = matchedData(req);

    // 3️⃣ Find user by username
    const user = await DB.user.findUnique({
      where: { Username: Username },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 4️⃣ Compare password
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    // 5️⃣ Generate token
    const token = jwt.sign(
      {
        id: user.Id,
        username: user.Username,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // 6️⃣ Response
    return res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        Id: user.Id,
        Username: user.Username,
        Name: user.Name,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
});

// REGISTER API
userRouter.post("/register", registerValidate, async (req, res) => {
  try {

    // 1️⃣ Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        msg: "Validation failed",
        errors: errors.array(),
      });
    }

    const { Name, Username, Password } = req.body;

    // 2️⃣ Check if user exists
    const existingUser = await DB.user.findUnique({
      where: { Username },
    });

    if (existingUser) {
      return res.status(409).json({
        msg: "Username already exists",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // 4️⃣ Create user in DB
    const newUser = await DB.user.create({
      data: {
        Name,
        Username,
        Password: hashedPassword,
      },
    });

    // 5️⃣ Response
    return res.status(201).json({
      msg: "User registered successfully",
      user: {
        Id: newUser.Id,
        Name: newUser.Name,
        Username: newUser.Username,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
});

export default userRouter;
