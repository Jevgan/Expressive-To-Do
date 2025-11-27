import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { ReminderNotification } from './components/ReminderNotidication'
import { AddTaskForm } from './components/AddTaskForm'
import { TaskItem } from './components/TaskItem'

const API_URL = "http://localhost:4000/api/tasks";

const api = {
    fetchTasks: async () => {
        console.log("API: Отримання завдань...");
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Не вдалося завантажити завдання');
        return await response.json();
    },
    addTask: async (taskData) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error('Не вдалося додати завдання');
        return await response.json();
    },
    fetchOneTask: async (taskId) => {
        const response = await fetch(`${API_URL}/${taskId}`)
        if (!response.ok) throw new Error('Такого завдання не знайдено');
        return await response.json();
    },
    updateTask: async (taskId, updates) => {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Не вдалося оновити завдання');
        return await response.json();
    },

    deleteTask: async (taskId) => {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Не вдалося видалити завдання');
        return { success: true };
    }
};

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); 
    const [remindingTask, setRemindingTask] = useState(null);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                setIsLoading(true);
                const fetchedTasks = await api.fetchTasks();
                setTasks(fetchedTasks);
                setError(null);
            } catch (err) {
                setError("Не вдалося завантажити завдання.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadTasks();
    }, []);

    useEffect(() => {
        const reminderTimers = [];
        tasks.forEach(task => {
            if (task.dueDate && !task.completed) {
                const dueTime = new Date(task.dueDate).getTime();
                const now = new Date().getTime();
                const timeUntilDue = dueTime - now;

                if (timeUntilDue > 0 && timeUntilDue < 2147483647) {
                    const timer = setTimeout(() => {
                        setRemindingTask(task);
                    }, timeUntilDue);
                    reminderTimers.push(timer);
                }
            }
        });
        return () => {
            reminderTimers.forEach(timer => clearTimeout(timer));
        };
    }, [tasks]);

    const handleAddTask = useCallback(async (taskData) => {
        try {
            const newTask = await api.addTask(taskData);
            setTasks(prevTasks => [newTask, ...prevTasks]);
        } catch (err) { console.error("Помилка додавання завдання:", err); }
    }, []);

    const handleToggleComplete = useCallback(async (taskId, completed) => {
        const originalTasks = [...tasks];
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, completed } : task
            ).sort((a, b) => (a.completed - b.completed))
        );
        try { await api.updateTask(taskId, { completed }); }
        catch (err) {
            console.error("Помилка оновлення статусу:", err);
            setTasks(originalTasks);
        }
    }, [tasks]);

    const handleUpdateTask = useCallback(async (taskId, updates) => {
        const originalTasks = [...tasks];
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, ...updates } : task
            )
        );
        try { await api.updateTask(taskId, updates); }
        catch (err) {
            console.error("Помилка оновлення завдання:", err);
            setTasks(originalTasks);
        }
    }, [tasks]);

    const handleDeleteTask = useCallback(async (taskId) => {
        const originalTasks = [...tasks];
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        try { await api.deleteTask(taskId); }
        catch (err) {
            console.error("Помилка видалення завдання:", err);
            setTasks(originalTasks);
        }
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        const sortedTasks = [...tasks].sort((a, b) => (a.completed - b.completed) || new Date(b.dueDate) - new Date(a.dueDate));
        if(filter == '' || filter == null) setFilter('all');

        switch (filter) {
            case 'active':
                return sortedTasks.filter(task => !task.completed);
            case 'completed':
                return sortedTasks.filter(task => task.completed);
            case 'all':
                return sortedTasks;
            default:
                return sortedTasks.filter(task => task.title.match(filter))
        }
    }, [tasks, filter]);

    const activeCount = useMemo(() => tasks.filter(task => !task.completed).length, [tasks]);

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <ReminderNotification task={remindingTask} onClose={() => setRemindingTask(null)} />
            <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">Планувальник завдань</h1>
                    <p className="mt-2 text-lg text-gray-500">Організуйте свій день, досягайте цілей</p>
                </header>

                <main>
                    <AddTaskForm onAddTask={handleAddTask} />

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-4 mb-4 gap-4">
                            <div className="text-sm text-gray-600 text-center sm:text-left">
                                Активних завдань: <span className="font-bold text-blue-600">{activeCount}</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Натисніть для пошуку завдань..."
                                onChange={e => setFilter(e.target.value)}
                                className="italic bg-gray-200 hover:bg-gray-300 text-gray-600 w-full rounded-full px-4 outline-none"
                            />
                            <div className="flex space-x-2 justify-center">
                                <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Всі</button>
                                <button onClick={() => setFilter('active')} className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Активні</button>
                                <button onClick={() => setFilter('completed')} className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Виконані</button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className=" mt-4 text-gray-500"></p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-500 bg-red-50 p-4 rounded-md">
                                {error}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map(task => (
                                        <TaskItem
                                            key={task.id}
                                            task={task}
                                            onToggleComplete={handleToggleComplete}
                                            onDelete={handleDeleteTask}
                                            onUpdate={handleUpdateTask}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="font-medium">Немає завдань для відображення.</p>
                                        <p className="text-sm">Спробуйте додати нове завдання або змінити фільтр.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
