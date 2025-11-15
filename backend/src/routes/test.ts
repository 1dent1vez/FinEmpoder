import { Router } from 'express';
import { createTest, getTests, getTest, deleteTest } from '../controllers/test.controller.js';

export const testRouter = Router();

testRouter.post('/', createTest);       // Crear
testRouter.get('/', getTests);          // Listar
testRouter.get('/:id', getTest);        // Obtener uno
testRouter.delete('/:id', deleteTest);  // Eliminar
