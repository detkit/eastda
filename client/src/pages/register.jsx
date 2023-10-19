import { Link } from 'react-router-dom';

export default function Register() {
	return (
		<div className='max-w-lg p-3 mx-auto'>
			<h1 className='text-3xl font-semibold text-center my-7'>
				Register
			</h1>
			<form className='flex flex-col gap-4'>
				<input
					type='text'
					placeholder='Username...'
					className='p-3 border rounded-lg'
					id='username'
				/>
				<input
					type='email'
					placeholder='Email...'
					className='p-3 border rounded-lg'
					id='email'
				/>
				<input
					type='password'
					placeholder='Password...'
					className='p-3 border rounded-lg'
					id='password'
				/>
				<button className='p-3 text-white uppercase bg-blue-500 rounded-lg hover:opacity-95 disabled:opacity-75'>
					Register
				</button>
			</form>
			<div className='flex gap-2 mt-5'>
				<p>Have an account?</p>
				<Link to='/login'>
					<span className='text-green-600'>Login</span>
				</Link>
			</div>
		</div>
	);
}
