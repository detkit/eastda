import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
dotenv.config();

mongoose.connect(process.env.MONG_DB).then(() => {
	console.log('Connected to MongoDB!');
});

const app = express();

app.listen(3000, () => {
	console.log('Server is running on port 3000!');
});
