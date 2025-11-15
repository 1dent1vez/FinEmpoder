import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type JWTPayload = { sub: string; email: string; iat: number; exp: number };

export function authGuard(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.header('Authorization') || req.header('authorization');
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: 'Falta JWT_SECRET en el servidor' });

    const payload = jwt.verify(token, secret) as JWTPayload;
    (req as any).user = { sub: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
