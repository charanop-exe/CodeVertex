import express from 'express';
import dotenv from 'dotenv';   
import cookieParser from "cookie-parser";


import authRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.routes.js';
import executionRoute from './routes/executeCode.routes.js';

dotenv.config();


const app = express();

app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}🔥`);
}
);
