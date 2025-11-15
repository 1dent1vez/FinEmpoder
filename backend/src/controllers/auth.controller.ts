// backend/src/controllers/auth.controller.ts
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { UserModel } from '../models/user.model.js';

// ==== Schemas embebidos (no necesitas auth.schema.ts) ====
const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    name: z.string().min(2).optional(),
    career: z.string().optional(),
    age: z.number().int().min(12).max(100).optional(),
    phone: z.string().min(7).max(20).optional(),
    acceptTerms: z.boolean().optional(), // si lo quieres obligatorio: refine(v => v === true)
  })
  .strip(); // ignora campos desconocidos

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ==== Helpers ====
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const signToken = (userId: string, email: string) =>
  jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: '7d' });

// ==== Controladores ====
export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body); // valida y hace strip

    const exists = await UserModel.findOne({ email: data.email });
    if (exists) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await UserModel.create({ ...data, password: hashed });

    // si quieres auto-login al registrarse:
    const token = signToken(user._id.toString(), user.email);

    return res.status(201).json({
      token,
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name ?? null,
      },
    });
  } catch (err) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: (err as Error).message,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = signToken(user._id.toString(), user.email);

    return res.json({
      token,
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name ?? null,
      },
    });
  } catch (err) {
    return res.status(400).json({
      error: 'Solicitud inválida',
      details: (err as Error).message,
    });
  }
}
