import { Express } from 'express';
import cookieParser from 'cookie-parser';
import { AuthAPI } from './services/auth.service';
import { authenticateJWT } from './services/jwt.service';

const scryptAsync = promisify(scrypt);
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

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

export function setupAuth(app:Express) {
  app.use(cookieParser());
  app.post('/api/Auth/register', async (req,res,next)=>{
      try { const out = await AuthAPI.register(req.body); res.status(201).json(out); }catch(err:any){ next(err); }
  });
  app.post('/api/Auth/login', async (req,res,next)=>{
      try { const out = await AuthAPI.login(req.body); res.status(200).json(out); }catch(err:any){ next(err); }
  });
    app.post('/api/Auth/logout', async (req, res) => { await AuthAPI.logout(); res.json({message:'Logged out'}); });
  app.get('/api/Auth/user', authenticateJWT, async (req,res)=> {
      const user = await AuthAPI.currentUser();
    res.json(user);
  });
  app.post('/api/Auth/users/:id/change-password', authenticateJWT, async (req,res)=>{
    const id = parseInt(req.params.id);
      const { currentPassword, newPassword } = req.body;
      const out = await AuthAPI.changePassword(id, currentPassword, newPassword);
    res.json(out);
  });
  app.patch('/api/Auth/users/:id', authenticateJWT, async (req,res)=>{
    const id = parseInt(req.params.id);
      const out = await AuthAPI.updateProfile(id, req.body);
    res.json(out);
  });
  app.get('/api/Auth/validate', authenticateJWT, async (req,res)=> {
      const u = await AuthAPI.currentUser();
    res.json({ valid:true, user:u });
  });
}
