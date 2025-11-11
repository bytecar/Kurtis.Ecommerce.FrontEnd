import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '@shared/schema';
import { storage } from "./storage";

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development-only';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// JWT payload structure
export interface JwtPayload {
  sub: number; // subject (user id)
  username: string;
  email: string | null;
  role: string;
  permissions: string[];
  iat?: number; // issued at
  exp?: number; // expiration time
}

// Define role-based permissions
const rolePermissions: Record<string, string[]> = {
  admin: [
    'admin:access',
    'user:read',
    'user:write',
    'product:read',
    'product:write',
    'inventory:read',
    'inventory:write',
    'order:read',
    'order:write',
    'review:read',
    'review:write',
    'dashboard:access',
    'returns:manage'
  ],
  contentManager: [
    'product:read',
    'product:write',
    'inventory:read',
    'inventory:write'
  ],
  customer: [
    'product:read',
    'review:write',
    'order:read',
    'wishlist:read',
    'wishlist:write',
    'profile:read',
    'profile:write',
    'returns:request'
  ]
};

// Get permissions for a role
export function getPermissionsForRole(role: string): string[] {
  return rolePermissions[role] || [];
}

// Generate JWT token for a user
export function generateToken(user: User): string {
  const permissions = getPermissionsForRole(user.role);
  
  const payload: JwtPayload = {
    sub: user.id,
    username: user.username,
    email: user.email || null,
    role: user.role,
    permissions
  };
  
  // Cast JWT_SECRET as jwt.Secret type to fix typings
  return jwt.sign(
    payload,
    JWT_SECRET as jwt.Secret
  ) as string;
}

// Verify JWT token
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    // Ensure the decoded token has the required JwtPayload structure
    if (decoded && typeof decoded === 'object' && 'sub' in decoded) {
      // Convert the decoded JWT payload to our specific JwtPayload type
      const payload: JwtPayload = {
        sub: Number(decoded.sub),
        username: String(decoded.username),
        email: decoded.email == null ? null : String(decoded.email),
        role: String(decoded.role),
        permissions: Array.isArray(decoded.permissions) ? decoded.permissions.map(String) : [],
        iat: typeof decoded.iat === 'number' ? decoded.iat : undefined,
        exp: typeof decoded.exp === 'number' ? decoded.exp : undefined
      };
      return payload;
    }
    return null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Express middleware to authenticate JWT tokens
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  // Get token from Authorization header or from cookies
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const tokenFromCookie = (req as any).cookies?.jwt;
  const token = tokenFromHeader || tokenFromCookie;
  
  if (!token) {
    return res.status(401).json({ error: 'No authentication token provided' });
  }
  
  const payload = verifyToken(token);
  
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  // Get user from database to ensure they still exist and are active
  storage.getUser(payload.sub).then(user => {
    if (!user || (user as any).status !== 'active') {
      return res.status(401).json({ error: 'User not found or inactive' });
    }
    
    // Add user and token info to request object
    (req as any).user = user;
    (req as any).token = payload;
    next();
  }).catch(error => {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Authentication error' });
  });
}

// Middleware to check if user has required permissions
export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const tokenPayload = (req as any).token as JwtPayload | undefined;
    
    if (!tokenPayload) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (tokenPayload.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ error: `Insufficient permissions (${permission} required)` });
    }
  };
}

// Middleware to check if user has a specific role
export function requireRole(role: string | string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const tokenPayload = (req as any).token as JwtPayload | undefined;
    
    if (!tokenPayload) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const roles = Array.isArray(role) ? role : [role];
    
    if (roles.includes(tokenPayload.role)) {
      next();
    } else {
      res.status(403).json({ error: `Insufficient role permissions (${roles.join(' or ')} required)` });
    }
  };
}

// Express middleware to refresh JWT token if it's close to expiry
export function refreshToken(req: Request, res: Response, next: NextFunction) {
  const tokenPayload = (req as any).token as JwtPayload | undefined;
  
  if (tokenPayload && tokenPayload.exp) {
    // Calculate time left until token expiry (in seconds)
    const timeUntilExpiry = tokenPayload.exp - Math.floor(Date.now() / 1000);
    
    // If token is about to expire in less than 15 minutes (900 seconds), refresh it
    if (timeUntilExpiry < 900 && (req as any).user) {
      const newToken = generateToken((req as any).user);
      res.cookie('jwt', newToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
    }
  }
  
  next();
}