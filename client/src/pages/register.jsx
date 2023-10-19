import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function Register() {
	const [formData, setFormData] = useState({});
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const handlerSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			const data = await res.json();

			if (data.success === false) {
				setIsLoading(false);
				setError(data.message);
				return;
			}
			setIsLoading(false);
			setError(null);
			navigate('/login');
		} catch (error) {
			setIsLoading(false);
			setError(error.message);
		}
	};

	return (
		<div className='max-w-lg p-3 mx-auto'>
			<h1 className='text-3xl font-semibold text-center my-7'>
				Register
			</h1>
			<form onSubmit={handlerSubmit} className='flex flex-col gap-4'>
				<input
					type='text'
					placeholder='Username...'
					className='p-3 border rounded-lg'
					id='username'
					onChange={handleChange}
				/>
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
					disabled={isLoading}
					className='p-3 text-white uppercase bg-blue-500 rounded-lg hover:opacity-95 disabled:opacity-75'
				>
					{isLoading ? 'Loading...' : 'Register'}
				</button>
				<OAuth />
			</form>
			{error && <p className='mt-5 text-red-500'>{error}</p>}
			<div className='flex gap-2 mt-5'>
				<p>Have an account?</p>
				<Link to='/login'>
					<span className='text-green-600'>Login</span>
				</Link>
			</div>
		</div>
	);
}
