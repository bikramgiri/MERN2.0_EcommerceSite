import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../database/models/userModel";

export interface AuthRequest extends Request {
  user?: {
    username: string;
    email: string;
    password: string;
    role: string;
    id: string;
  };
}

export enum Role{
  Admin = "admin",
  Customer = "customer"
}

class authMiddleware {
  // *Authentication Middleware
  async isAuthenticated(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // get token from headers
      const token = req.headers.authorization;
      if (!token || token === undefined) {
        res.status(401).json({
          message: "No token provided",
        });
        return;
      }
      // verify token
      jwt.verify(token, process.env.JWT_SECRET_KEY as string, async (err, decoded: any) => {
          if (err) {
            res.status(401).json({
              message: "Unauthorized! Invalid token",
            });
          } else {
            // check if that decoded user exists or not
            const useData = await User.findByPk(decoded.id);
            if (!useData) {
              res.status(404).json({
                message: "User not found",
              });
              return;
            }
            req.user = useData;
            next();
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }

  // *Authorization Middleware
  authorizeRole(...roles: Role[]) {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      let userRole = req.user?.role as Role
      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: `Role (${userRole}) don't have permission to do this action.`,
        });
        return;
      }
      next();
    };
  }
}

export default new authMiddleware();
