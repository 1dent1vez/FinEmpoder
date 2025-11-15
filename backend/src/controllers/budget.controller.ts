import type { Request, Response } from 'express';
import { BudgetModel } from '../models/budget.model.js';
import { BudgetCreateSchema, BudgetUpdateSchema } from '../schemas/budget.schema.js';


export async function listBudget(req: Request, res: Response) {
  const userId = (req as any).user.sub;
  const { from, to, type, category } = req.query;
  const q: any = { userId };
  if (type) q.type = type;
  if (category) q.category = category;
  if (from || to) q.date = {
    ...(from ? { $gte: new Date(String(from)) } : {}),
    ...(to ? { $lte: new Date(String(to)) } : {}),
  };
  const rows = await BudgetModel.find(q).sort({ date: -1 }).limit(500);
  res.json(rows);
}

export async function createBudget(req: Request, res: Response) {
  const userId = (req as any).user.sub;
  const parsed = BudgetCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const doc = await BudgetModel.create({ ...parsed.data, userId, date: new Date(parsed.data.date) });
  res.status(201).json(doc);
}

export async function getBudget(req: Request, res: Response) {
  const userId = (req as any).user.sub;
  const doc = await BudgetModel.findOne({ _id: req.params.id, userId });
  if (!doc) return res.status(404).json({ error: 'not_found' });
  res.json(doc);
}

export async function updateBudget(req: Request, res: Response) {
  const userId = (req as any).user.sub;
  const parsed = BudgetUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const upd = { ...parsed.data } as any;
  if (upd.date) upd.date = new Date(upd.date);
  const doc = await BudgetModel.findOneAndUpdate(
    { _id: req.params.id, userId },
    { $set: upd },
    { new: true }
  );
  if (!doc) return res.status(404).json({ error: 'not_found' });
  res.json(doc);
}

export async function deleteBudget(req: Request, res: Response) {
  const userId = (req as any).user.sub;
  const r = await BudgetModel.deleteOne({ _id: req.params.id, userId });
  if (!r.deletedCount) return res.status(404).json({ error: 'not_found' });
  res.status(204).end();
}

export async function summaryBudget(req: Request, res: Response) {
  const userId = (req as any).user.sub;
  const { from, to } = req.query;
  const match: any = { userId };
  if (from || to) match.date = {
    ...(from ? { $gte: new Date(String(from)) } : {}),
    ...(to ? { $lte: new Date(String(to)) } : {}),
  };

  const [agg] = await BudgetModel.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
      },
    },
  ]);

  const byCategory = await BudgetModel.aggregate([
    { $match: match },
    { $group: { _id: { type: '$type', category: '$category' }, total: { $sum: '$amount' } } },
    { $sort: { '_id.type': 1, total: -1 } },
  ]);

  const income = await BudgetModel.aggregate([{ $match: { ...match, type: 'income' } }, { $group: { _id: null, t: { $sum: '$amount' } } }]);
  const expense = await BudgetModel.aggregate([{ $match: { ...match, type: 'expense' } }, { $group: { _id: null, t: { $sum: '$amount' } } }]);

  res.json({
    income: income[0]?.t ?? 0,
    expense: expense[0]?.t ?? 0,
    balance: (income[0]?.t ?? 0) - (expense[0]?.t ?? 0),
    byCategory,
  });
}
