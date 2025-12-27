import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt";

class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please provide username, email and password",
      });
      return;
    }

    // validate if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      res.status(409).json({
        message: "User with this email already exists",
      });
      return;
    }

    // valiadte user length must be greater than 3
    if (username.length < 3) {
      res.status(400).json({
        message: "Username must be at least 3 characters long",
      });
      return;
    }

    // valiadte email format like ram12gmail.com, ram@gmail.com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        message: "Please provide a valid email address",
      });
      return;
    }

    // validate if email already exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      res.status(409).json({
        message: "User with this email already exists",
      });
      return;
    }

    // validate password length must be greater than 8
    if (password.length < 8) {
      res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
      return;
    }

    try {
      const newUser = await User.create({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 8),
      });

      res.status(201).json({
        message: "User registered successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
}

export default AuthController;
