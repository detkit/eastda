import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<header className='shadow-md bg-slate-200'>
			<div className='flex items-center justify-between max-w-6xl p-3 mx-auto'>
				<h1 className='flex text-sm font-bold sm:text-xl fle-wrap'>
					<span className='text-slate-500'>Sasa</span>
					<span className='text-slate-700'>Easted</span>
				</h1>
				<form className='flex items-center p-3 rounded-lg bg-slate-100'>
					<input
						type='text'
						placeholder='Search..'
						className='w-24 bg-transparent focus:outline-none sm:w-64'
					/>
					<FaSearch className='text-slate-600' />
				</form>

				<ul className='flex gap-4'>
					<Link className='hidden cursor-pointer sm:inline-block text-slate-700 hover:underline'>
						Home
					</Link>
					<Link className='hidden cursor-pointer sm:inline-block text-slate-700 hover:underline'>
						About
					</Link>
					<Link className='cursor-pointer text-slate-700 hover:underline'>
						Login
					</Link>
				</ul>
			</div>
		</header>
	);
};

export default Header;
