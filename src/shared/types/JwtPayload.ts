export interface JwtPayload {
  iat: number;
  exp: number;
  sub: number;
  username: string;
  permissions: string[];
  userId: string;
  email: string;
  role: string;
}