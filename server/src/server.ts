import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({quiet : true});
const app = express();

app.use(cors());
app.use(express.json());

import tasksRoutes from "./routes/Tasks";
app.use("/api/tasks", tasksRoutes);

app.listen(process.env.API_PORT, () => {
    console.log(`Сервер запущено і працює на http://localhost:${process.env.API_PORT}`);
});
