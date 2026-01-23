import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../../models/userModel";
import sendEmail from "../../services/sendEmail";

class AuthController {
  // *User Registration
  public static async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please provide username, email and password",
        field: "general",
      });
      return;
    }

    // valiadte user length must be greater than 3
    if (username.length < 3) {
      res.status(400).json({
        message: "Username must be at least 3 characters long",
        field: "username",
      });
      return;
    }

    // valiadte email format like ram12gmail.com, ram@gmail.com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        message: "Please provide a valid email address",
        field: "email",
      });
      return;
    }

    // validate if email already exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      res.status(409).json({
        message: "User with this email already exists",
        field: "email",
      });
      return;
    }

    // validate password length must be at least 8 characters
    if (password.length < 8) {
      res.status(400).json({
        message: "Password must be at least 8 characters long",
        field: "password",
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
        field: "general",
      });
      return;
    }

    try {
      // Check if user exists
      const userExist = await User.findOne({ where: { email } });
      if (!userExist) {
        res.status(404).json({
          message: "User not found",
          field: "email",
        });
        return;
      }

      // Validate password
      const passwordIsValid = bcrypt.compareSync(password, userExist.password);
      if (!passwordIsValid) {
        res.status(401).json({
          message: "Invalid password",
          field: "password",
        });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: userExist.id },
        process.env.JWT_SECRET_KEY as string,
        
        {
          expiresIn: "1d", // Token valid for 1 day
        },
      );

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

  // *Forgot password
  public static async forgotPassword(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        message: "Please provide email",
        field: "email",
      });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        message: "Invalid email format",
      });
      return;
    }

    // *for all email: tyo email ma otp pathaunae
    // const allUsers = await User.findAll();
    // const userEmails = allUsers.map((user) => user.email);
    // console.log("User Emails:", userEmails);

    // Check if user exists
    const userExist = await User.findOne({ where: { email } });
    if (!userExist) {
      res.status(404).json({
        message: "User not found",
        field: "email",
      });
      return;
    }

    // Generate OTP
    const generateotp = Math.floor(100000 + Math.random() * 900000).toString(); 

    // Save OTP and OTP expiry to user record
    userExist.otp = generateotp;
    userExist.otpGeneratedTime = new Date(Date.now());
    await userExist.save();

    // // *for all email: tyo email ma otp pathaunae
    // for(let i = 0; i < allUsers.length; i++){
    //   await sendEmail({
    //     email : allUsers[i].email,
    //     subject : "OTP for password reset",
    //     otp : Math.floor(100000 + Math.random() * 900000) // Generate a random 6-digit OTP
    //   })
    // }

    // *for one email: tyo email ma otp pathaunae
    await sendEmail({
      email: email,
      subject: "Password Reset OTP",
      otp: generateotp,
    });

    res.status(200).json({
      message: "OTP sent to your email for password reset.",
      data: userExist.email,
    });
  }

  // *Verify OTP
  public static async verifyOtp(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({
        message: "Please provide email and otp",
        field: "general",
      });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      message: "Invalid email format",
    });
    return;
  }

    // Check if user exists
    const userExist = await User.findOne({ where: { email } });
    if (!userExist) {
      res.status(404).json({
        message: "User not found",
        field: "email",
      });
      return;
    }

    // check otp must 6 digits
    if (otp.length !== 6) {
      res.status(400).json({
        message: "OTP must be 6 digits",
        field: "otp",
      });
      return;
    }

    // Check if OTP is valid
    if (userExist.otp !== otp) {
      res.status(400).json({
        message: "Invalid OTP",
        field: "otp",
      });
      return;
    }

      // Check if OTP is expired
  const currentTime = Date.now();
  const otpGeneratedTime = userExist.otpGeneratedTime;
  const timeDifference = currentTime - otpGeneratedTime.getTime();
  const otpExpiryTime = 59 * 60 * 1000; // 3 minutes in milliseconds
  if (timeDifference > otpExpiryTime) {
    // Check if OTP has expired
    res.status(400).json({
      message: "OTP has expired",
    });
    return;
  }

  // save the OTP
  userExist.otp = otp; // Save OTP to user document
  userExist.otpGeneratedTime = new Date(Date.now()); // Save OTP generated time
  await userExist.save(); // Save the updated user document

    res.status(200).json({
      message: "OTP verified successfully",
    });
  }

  // *Change Password
  public static async changePassword(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { email, otp, newPassword, confirmPassword } = req.body;
    if (!email || !otp || !newPassword || !confirmPassword) {
      res.status(400).json({
        message: "Please provide email, otp and new password",
        field: "general",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|in)$/i; // Case-insensitive, allows common TLDs
  if (!emailRegex.test(email)) {
   res.status(400).json({
      message: "Invalid email format",
    });
    return;
  }

    // Check if user exists
    const userExist = await User.findOne({ where: { email } });
    if (!userExist) {
      res.status(404).json({
        message: "User not found",
        field: "email",
      });
      return;
    }

    // check otp must 6 digits
    if (otp.length !== 6) {
      res.status(400).json({
        message: "OTP must be 6 digits",
        field: "otp",
      });
      return;
    }

    // Check if OTP is valid
    if (userExist.otp !== otp) {
      res.status(400).json({
        message: "Invalid OTP",
        field: "otp",
      });
      return;
    }

      // Check if OTP is expired
  const currentTime = Date.now();
  const otpGeneratedTime = userExist.otpGeneratedTime;
  const timeDifference = currentTime - otpGeneratedTime.getTime();
  const otpExpiryTime = 59 * 60 * 1000; // 2 minutes in milliseconds
  if (timeDifference > otpExpiryTime) {
    // Check if OTP has expired
    res.status(400).json({
      message: "OTP has expired",
    });
    return;
  }

  // save the OTP
  userExist.otp = otp; // Save OTP to user document
  userExist.otpGeneratedTime = new Date(Date.now()); // Save OTP generated time
  await userExist.save(); // Save the updated user document

  // Validate new password strength
  if (newPassword.length < 8) {
    res.status(400).json({
      message: "New password must be at least 8 characters long",
    });
    return;
  }

  // Check if new password and confirm password match
  if (newPassword !== confirmPassword) {
    res.status(400).json({
      message: "New password and confirm password do not match",
    });
    return;
  }

  // Update the user's password
  userExist.password = bcrypt.hashSync(newPassword, 10); // Hash the new password
  await userExist.save(); // Save the updated user document

  }
}

export default AuthController;
