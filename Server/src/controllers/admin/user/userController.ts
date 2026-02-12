import { Response } from "express";
import { AuthRequest } from "../../../middleware/authMiddleware";
import User from "../../../models/userModel";


class UserController {
      public static async fetchAllUsers(req: AuthRequest, res: Response) {
            try {
                  const users = await User.findAll();
                  if (!users) {
                        return res.status(404).json({ message: 'No users found' });
                  }

                  return res.status(200).json({
                        message: 'Users fetched successfully',
                        data: users
                  });
            } catch (error) {
                  res.status(500).json({ message: 'Error fetching users', error });
            }
      }

      public static async deleteUser(req: AuthRequest, res: Response) {
            try {
                  const userId = req.params.id;
                  if (!userId) {
                        return res.status(400).json({ message: 'User ID is required' });
                  }
                  
                  await User.destroy({ where: { id: userId } });

                  res.status(200).json({
                        message: 'User deleted successfully'
                  });
            } catch (error) {
                  res.status(500).json({ message: 'Error deleting user', error });
            }
      }
}

export default UserController;
