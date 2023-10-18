import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
dotenv.config();

import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoutes.js';

mongoose
	.connect(process.env.MONGO_DB)
	.then(() => {
		console.log('Connected to MongoDB!');
	})
	.catch((err) => {
		console.log(err);
	});

const app = express();

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.listen(3000, () => {
	console.log('Server is running on port 3000!');
});
