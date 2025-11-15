import type { Request, Response } from 'express';
import { TestModel } from '../models/test.model.js';

export async function createTest(req: Request, res: Response) {
  try {
    const item = await TestModel.create({ name: req.body.name });
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: 'error creando test' });
  }
}

export async function getTests(_req: Request, res: Response) {
  try {
    const items = await TestModel.find();
    res.status(200).json(items);
  } catch {
    res.status(500).json({ error: 'error obteniendo tests' });
  }
}

export async function getTest(req: Request, res: Response) {
  try {
    const item = await TestModel.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'no encontrado' });
    res.status(200).json(item);
  } catch {
    res.status(500).json({ error: 'error buscando test' });
  }
}

export async function deleteTest(req: Request, res: Response) {
  try {
    const result = await TestModel.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'no encontrado' });
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'error eliminando test' });
  }
}
