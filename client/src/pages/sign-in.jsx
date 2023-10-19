import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import {
	logInFailure,
	logInStart,
	logInSuccess,
} from '../redux/user/userSlice';

export default function SignIn() {
	const [formData, setFormData] = useState({});
	const { loading, error } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const handlerSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(logInStart());
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			const data = await res.json();
			if (data.success === false) {
				dispatch(logInFailure(data.message));
				return;
			}
			dispatch(logInSuccess(data));
			navigate('/');
		} catch (error) {
			dispatch(logInFailure(error.message));
		}
	};

	return (
		<div className='max-w-lg p-3 mx-auto'>
			<h1 className='text-3xl font-semibold text-center my-7'>Log In</h1>
			<form onSubmit={handlerSubmit} className='flex flex-col gap-4'>
				<input
					type='email'
					placeholder='Email...'
					className='p-3 border rounded-lg'
					id='email'
					onChange={handleChange}
				/>
				<input
					type='password'
					placeholder='Password...'
					className='p-3 border rounded-lg'
					id='password'
					onChange={handleChange}
				/>
				<button
					disabled={loading}
					className='p-3 text-white uppercase bg-blue-500 rounded-lg hover:opacity-95 disabled:opacity-75'
				>
					{loading ? 'Loading...' : 'Login'}
				</button>
				<OAuth />
			</form>
			{error && <p className='mt-5 text-red-500'>{error}</p>}
			<div className='flex gap-2 mt-5'>
				<p>Don&apos;t have an account?</p>
				<Link to='/register'>
					<span className='text-green-600'>Register</span>
				</Link>
			</div>
		</div>
	);
}
