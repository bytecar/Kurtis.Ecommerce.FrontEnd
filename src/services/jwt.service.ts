import jwt from 'jsonwebtoken';
<<<<<<< HEAD
import { JwtPayload } from "@/shared/types/JwtPayload";
=======
import { JwtPayload } from "@shared/types/JwtPayload";
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
import type { Request, Response, NextFunction } from 'express';
import { UsersAPI } from './users.service';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET ?? "fPXxcJw8TW5sA+S4rl4tIPcKk+oXAqoRBo+1s2yjUS4=";
<<<<<<< HEAD
export function generateToken(payload: JwtPayload) {
  return jwt.sign({ ...payload }, JWT_SECRET, { expiresIn: "24h" });
}
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
=======
export function generateToken(payload:JwtPayload) {
    return jwt.sign({...payload}, JWT_SECRET, { expiresIn : "24h" });
}
export function verifyToken(token:string): JwtPayload{
  try {
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
    return {
      sub: Number(decoded.sub),
      username: String(decoded.username),
      email: String(decoded.email),
      role: decoded.role,
      permissions: Array.isArray(decoded.permissions) ? decoded.permissions.map(String) : [],
<<<<<<< HEAD
      iat: decoded.iat ?? 0,
      exp: decoded.exp ?? 0,
      userId: String(decoded.userId)
    };
  } catch (e: any) {
    return null;
  }
}
export async function authenticateJWT(req: Request, res: Response, next: NextFunction) {
=======
      iat: decoded.iat,
      exp: decoded.exp,
      userId: String(decoded.userId)
    };
  } catch(e:any) {
    return null;
  }
}
export async function authenticateJWT(req:Request,res:Response,next:NextFunction) {
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader!.substring(7) : null;
  const tokenFromCookie = (req as any).cookies?.jwt;
  const token = tokenFromHeader || tokenFromCookie;
  if (!token) return res.status(401).json({ error: 'No authentication token provided' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'Invalid or expired token' });
  try {
    const user = await UsersAPI.getUser(payload.sub);
    if (!user || (user as any).status !== 'active') return res.status(401).json({ error: 'User not found or inactive' });
    (req as any).user = user;
    (req as any).token = payload;
    next();
<<<<<<< HEAD
  } catch (err: any) {
=======
  } catch(err:any) {
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
    console.error('authenticateJWT error', err);
    return res.status(500).json({ error: 'Authentication error' });
  }
}
<<<<<<< HEAD
export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const tokenPayload = (req as any).token as JwtPayload;
    if (!tokenPayload) return res.status(401).json({ error: 'Not authenticated' });
    if (tokenPayload.permissions.includes(permission)) return next();
    return res.status(403).json({ error: `Insufficient permissions (${permission} required)` });
  };
}
export function requireRole(role: string | string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const tokenPayload = (req as any).token as JwtPayload;
    if (!tokenPayload) return res.status(401).json({ error: 'Not authenticated' });
    const roles = Array.isArray(role) ? role : [role];
    if (roles.includes(tokenPayload.role)) return next();
    return res.status(403).json({ error: `Insufficient role permissions (${roles.join(' or ')} required)` });
=======
export function requirePermission(permission:string) {
  return (req:Request,res:Response,next:NextFunction) => {
    const tokenPayload = (req as any).token as JwtPayload;
    if (!tokenPayload) return res.status(401).json({ error:'Not authenticated' });
    if (tokenPayload.permissions.includes(permission)) return next();
    return res.status(403).json({ error:`Insufficient permissions (${permission} required)`});
  };
}
export function requireRole(role:string|string[]) {
  return (req:Request,res:Response,next:NextFunction) => {
    const tokenPayload = (req as any).token as JwtPayload;
    if (!tokenPayload) return res.status(401).json({ error:'Not authenticated' });
    const roles = Array.isArray(role)?role:[role];
    if (roles.includes(tokenPayload.role)) return next();
    return res.status(403).json({ error:`Insufficient role permissions (${roles.join(' or ')} required)`});
>>>>>>> fc6a7514ce55db2e4e35223257173877c0e98758
  };
}
