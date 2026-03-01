import { Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware";
import User from "../../models/userModel";
const bcrypt = require("bcrypt");

class ProfileController {
  public static async fetchMyProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({
          message: "User ID is required",
          field: "userId",
        });
      }

      const profile = await User.findByPk(userId, {
        attributes: { exclude: ["password", "otp", "otpGeneratedTime"] },
      });
      if (!profile) {
        return res.status(404).json({
          message: "User not found",
          field: "user",
        });
      }

      return res.status(200).json({
        message: "Profile fetched successfully",
        data: profile,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching profile",
        field: "profile",
      });
    }
  }

  public static async updateMyProfile(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        field: "userId",
      });
    }

    const { username, email } = req.body;
    if (!username && !email) {
      return res.status(400).json({
        message: "Please provide username or email to update",
        field: "data incomplete",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
            message: "User not found",
            field: "user",
      });
    }

    const updateProfile = await user.update({ 
      username, 
      email, 
      });

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updateProfile
    });
  }

  // update password
  public static async updateMyPassword(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        field: "userId",
      });
    }

    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        message: "All password fields are required",
        field: "password",
      });
    }

    // check if current password is correct
    const userExist = await User.findByPk(userId);
    if (!userExist) {
      return res.status(404).json({
        message: "User not found",
        field: "user",
      });
    }

      const isPasswordValid = bcrypt.compareSync(currentPassword, userExist.password);
      if (!isPasswordValid) {
            return res.status(401).json({
                  message: "Current password is incorrect",
                  field: "currentPassword",
            });
      }

    // Validate new password strength
    if (newPassword.length < 8) {
      res.status(400).json({
        message: "New password must be at least 8 characters long",
        field: "newPassword",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      res.status(400).json({
        message: "New password and confirm password do not match",
        field: "confirmNewPassword",
      });
      return;
    }

    userExist.password = bcrypt.hashSync(newPassword, 8);
    await userExist.save();

    return res.status(200).json({
      message: "Password changed successfully"
    });
  }
}
export default ProfileController;
