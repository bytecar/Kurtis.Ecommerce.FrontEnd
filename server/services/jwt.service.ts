import jwt, { Secret } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { UserAPI } from './user.service';

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? 'fPXxcJw8TW5sA+S4rl4tIPcKk+oXAqoRBo+1s2yjUS4=';
export interface JwtPayload {
  sub:number;
  username:string;
  email:string|null;
  role:string;
  permissions:string[];
  iat?:number;
  exp?:number;
}
export function generateToken(payload:any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
}
export function verifyToken(token:string): JwtPayload|null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      sub: Number(decoded.sub),
      username: String(decoded.username),
      email: decoded.email == null ? null : String(decoded.email),
      role: String(decoded.role),
      permissions: Array.isArray(decoded.permissions) ? decoded.permissions.map(String) : [],
      iat: typeof decoded.iat === 'number' ? decoded.iat : undefined,
      exp: typeof decoded.exp === 'number' ? decoded.exp : undefined
    };
  } catch(e:any) {
    return null;
  }
}
export async function authenticateJWT(req:Request,res:Response,next:NextFunction) {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader!.substring(7) : null;
  const tokenFromCookie = (req as any).cookies?.jwt;
  const token = tokenFromHeader || tokenFromCookie;
  if (!token) return res.status(401).json({ error: 'No authentication token provided' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid or expired token' });
  try {
    const user = await UserAPI.getUser(payload.sub);
    if (!user || (user as any).status !== 'active') return res.status(401).json({ error: 'User not found or inactive' });
    (req as any).user = user;
    (req as any).token = payload;
    next();
  } catch(err:any) {
    console.error('authenticateJWT error', err);
    return res.status(500).json({ error: 'Authentication error' });
  }
}
export function requirePermission(permission:string) {
  return (req:Request,res:Response,next:NextFunction) => {
    const tokenPayload = (req as any).token as JwtPayload|undefined;
    if (!tokenPayload) return res.status(401).json({ error:'Not authenticated' });
    if (tokenPayload.permissions.includes(permission)) return next();
    return res.status(403).json({ error:`Insufficient permissions (${permission} required)`});
  };
}
export function requireRole(role:string|string[]) {
  return (req:Request,res:Response,next:NextFunction) => {
    const tokenPayload = (req as any).token as JwtPayload|undefined;
    if (!tokenPayload) return res.status(401).json({ error:'Not authenticated' });
    const roles = Array.isArray(role)?role:[role];
    if (roles.includes(tokenPayload.role)) return next();
    return res.status(403).json({ error:`Insufficient role permissions (${roles.join(' or ')} required)`});
  };
}
