import express from 'express';
const router = express.Router();

import { AddTask, DeleteTask, UpdateTask, GetAllTasks } from '../controllers/Tasks';

router.get('/', GetAllTasks);
router.post('/', AddTask);
router.patch('/:id', UpdateTask);
router.delete('/:id', DeleteTask);

export default router;
