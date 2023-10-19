import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const register = async (req, res, next) => {
	const { username, email, password } = req.body;
	const hashedPassword = bcryptjs.hashSync(password, 10);
	const newUser = new User({ username, email, password: hashedPassword });
	try {
		await newUser.save();
		res.status(201).json('User successfully registered');
	} catch (error) {
		next(error);
	}
};

export const login = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const validUser = await User.findOne({ email: email });

		if (!validUser) return next(errorHandler(404, 'User not found'));
		const validPassword = bcryptjs.compareSync(
			password,
			validUser.password
		);
		if (!validPassword) {
			return next(errorHandler(404, 'Wrong credentials!'));
		}
		const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
		const { password: hashedPassword, ...userInfo } = validUser._doc;
		res.cookie('access_token', token, { httpOnly: true })
			.status(200)
			.json(userInfo);
	} catch (error) {
		next(error);
	}
};
