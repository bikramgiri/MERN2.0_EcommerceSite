import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../../models/userModel";

class AuthController {
  // *User Registration
  public static async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please provide username, email and password",
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
  
  // *User Login
  public static async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email and password",
      });
      return;
    }

    try {
      // Check if user exists
      const userExist = await User.findOne({ where: { email } });
      if (!userExist) {
        res.status(404).json({
          message: "User not found",
        });
        return;
      }

      // Validate password
      const passwordIsValid = bcrypt.compareSync(password, userExist.password);
      if (!passwordIsValid) {
        res.status(401).json({
          message: "Invalid email or password",
        });
        return;
      }

      // Generate JWT token 
      const token = jwt.sign({ id: userExist.id }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: "1d", // Token valid for 1 day
      });

      // Set token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.status(200).json({
        message: "Login successful",
        data: userExist,
        token: token,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }

  // *User Logout
  public static async logoutUser(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("token");
      res.status(200).json({
        message: "Logout successful",
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
}

export default AuthController;
