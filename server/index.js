import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
dotenv.config();

import { test } from './controllers/userController.js';

mongoose
	.connect(process.env.MONGO_DB)
	.then(() => {
		console.log('Connected to MongoDB!');
	})
	.catch((err) => {
		console.log(err);
	});

const app = express();

app.use('/api/user', test);

app.listen(3000, () => {
	console.log('Server is running on port 3000!');
});
