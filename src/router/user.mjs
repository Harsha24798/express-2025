import { Router } from "express";
import DB from "../db/db.mjs";

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

export default userRouter;
