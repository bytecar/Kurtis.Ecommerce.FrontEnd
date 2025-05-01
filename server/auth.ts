import { Express, Request, Response, NextFunction } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import cookieParser from "cookie-parser";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { 
  generateToken, 
  authenticateJWT, 
  requirePermission, 
  requireRole 
} from "./jwt-auth";

const scryptAsync = promisify(scrypt);

// JWT Cookie options for better security and lower network overhead
const JWT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: '/'
};

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Middleware to parse cookies
  app.use(cookieParser());
  
  // Register routes
  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Default role to customer for new registrations
      const userData = {
        ...req.body,
        role: req.body.role || "customer",
        status: "active", // Important for JWT auth
        password: await hashPassword(req.body.password),
      };

      const user = await storage.createUser(userData);

      // Generate JWT token
      const token = generateToken(user);
      
      // Set JWT in cookie for secure storage
      res.cookie('jwt', token, JWT_COOKIE_OPTIONS);
      
      // Remove password before sending user data
      const { password, ...userResponse } = user;
      
      res.status(201).json({
        user: userResponse,
        token // Also send token in response for mobile clients
      });
    } catch (error) {
      next(error);
    }
  });

  // Login route
  app.post("/api/login", async (req, res, next) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Authenticate user
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check if user is active
      if (user.status !== "active") {
        return res.status(403).json({ message: "Account is not active" });
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Set JWT in cookie for secure storage
      res.cookie('jwt', token, JWT_COOKIE_OPTIONS);
      
      // Remove password before sending user data
      const { password: _, ...userResponse } = user;
      
      res.status(200).json({
        user: userResponse,
        token // Also send token in response for mobile clients
      });
    } catch (error) {
      next(error);
    }
  });

  // Logout route
  app.post("/api/logout", (req, res) => {
    // Clear the JWT cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    res.status(200).json({ message: "Logged out successfully" });
  });

  // Get current user route (protected)
  app.get("/api/user", authenticateJWT, (req, res) => {
    // Remove password before sending user data
    const { password, ...userResponse } = (req as any).user;
    res.json(userResponse);
  });

  // Change password endpoint (protected)
  app.post("/api/users/:id/change-password", authenticateJWT, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUser = (req as any).user;
      
      // Only allow users to change their own password unless they're an admin
      if (currentUser.id !== userId && currentUser.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to change another user's password" });
      }

      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Both current and new passwords are required" });
      }

      // Verify current password
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Update password
      const hashedNewPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(userId, hashedNewPassword);

      // Generate new token with updated data
      if (currentUser.id === userId) {
        const updatedUser = await storage.getUser(userId);
        if (updatedUser) {
          const newToken = generateToken(updatedUser);
          res.cookie('jwt', newToken, JWT_COOKIE_OPTIONS);
        }
      }

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Update user profile (protected)
  app.patch("/api/users/:id", authenticateJWT, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUser = (req as any).user;
      
      // Only allow users to update their own profile unless they're an admin
      if (currentUser.id !== userId && currentUser.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update another user's profile" });
      }

      const { fullName, email } = req.body;
      
      // Check if email already exists (if changing email)
      if (email && email !== currentUser.email) {
        const existingEmail = await storage.getUserByEmail(email);
        if (existingEmail && existingEmail.id !== userId) {
          return res.status(400).json({ message: "Email already in use" });
        }
      }

      // Update user
      const updatedUser = await storage.updateUser(userId, { fullName, email });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate new token with updated data if user is updating their own profile
      if (currentUser.id === userId) {
        const newToken = generateToken(updatedUser);
        res.cookie('jwt', newToken, JWT_COOKIE_OPTIONS);
      }

      // Remove password before sending response
      const { password, ...userResponse } = updatedUser;
      res.status(200).json(userResponse);
    } catch (error) {
      next(error);
    }
  });
  
  // Validate token endpoint (useful for frontend to check token validity)
  app.get("/api/auth/validate", authenticateJWT, (req, res) => {
    const { password, ...userResponse } = (req as any).user;
    res.status(200).json({
      valid: true,
      user: userResponse
    });
  });
}
