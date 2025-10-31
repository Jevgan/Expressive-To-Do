import { Request, Response } from 'express';
import { Task } from '../../generated/prisma'
import prisma from '../utils/db';

export const GetAllTasks = async (req: Request, res: Response) => {
    console.log('GET /api/tasks - Отримано запит на всі завдання');
    const tasks: Task[] = await prisma.task.findMany();
    res.json(tasks);
}

interface CreateTaskBody {
    title: string;
    description?: string;
    dueDate?: Date;
}

export const AddTask = async (req: Request, res: Response) => {
    const { title, description, dueDate } = req.body as CreateTaskBody;

    if (!title) {
        console.log(`Title: ${title}`)
        return res.status(400).json({ message: 'Назва завдання є обов\'язковою' });
    }

    const task: Task = await prisma.task.create({
        data: {
            title,
            description: description || '',
            dueDate: dueDate ? new Date(dueDate) : null,
            completed: false
        }
    });

    console.log('POST /api/tasks - Створено нове завдання:', task);
    res.status(201).json(task);
}

interface UpdateTaskBody {
    title?: string;
    description?: string;
    dueDate?: Date;
    completed?: boolean;
}

export const UpdateTask = async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);
    const {
        title, description, dueDate, completed
    } = req.body as UpdateTaskBody;

    const updatedTask: Task = await prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            title,
            description,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            completed
        }
    })
    if (!updatedTask) {
        return res.status(404).json({ message: 'Завдання не знайдено. Завдення не оновлено.' });
    }

    console.log(`PATCH /api/tasks/${taskId} - Оновлено завдання:`, updatedTask);
    res.json(updatedTask);
}

export const GetTaskById = (req: Request, res: Response) => {

}

export const DeleteTask = async (req: Request, res: Response) => {
    const taskId: number = parseInt(req.params.id);

    const deletedTask: Task = await prisma.task.delete({
        where: {
            id: taskId
        }
    });
    
    if(!deletedTask){
        return res.status(404).json({ message: 'Завдання не знайдено. Видалення не завершено.' });
    }

    console.log(`DELETE /api/tasks/${taskId} - Завдання видалено`);
    res.status(204).send(); // 204 No Content - успішне видалення
}
