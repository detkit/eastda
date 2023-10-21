import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
	const { currentUser } = useSelector((state) => state.user);
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set('searchTerm', searchTerm);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get('searchTerm');
		if (searchTermFromUrl) {
			setSearchTerm(searchTermFromUrl);
		}
	}, [location.search]);

	return (
		<header className='shadow-md bg-slate-200'>
			<div className='flex items-center justify-between max-w-6xl p-3 mx-auto'>
				<h1 className='flex text-sm font-bold sm:text-xl fle-wrap'>
					<span className='text-slate-500'>Sasa</span>
					<span className='text-slate-700'>Easted</span>
				</h1>
				<form
					onSubmit={handleSearch}
					className='flex items-center p-3 rounded-lg bg-slate-100'
				>
					<input
						type='text'
						placeholder='Search..'
						className='w-24 bg-transparent focus:outline-none sm:w-64'
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<button>
						<FaSearch className='text-slate-600' />
					</button>
				</form>

				<ul className='flex gap-4'>
					<Link
						to='/'
						className='hidden cursor-pointer sm:inline-block text-slate-700 hover:underline'
					>
						Home
					</Link>
					<Link
						to='/about'
						className='hidden cursor-pointer sm:inline-block text-slate-700 hover:underline'
					>
						About
					</Link>
					<Link
						to='/profile'
						className='cursor-pointer text-slate-700 hover:underline'
					>
						{currentUser ? (
							<img
								src={currentUser.avatar}
								alt='profile'
								className='object-cover rounded-full h-7 w-7'
							/>
						) : (
							<li className='text-slate-700 hover:underline'>
								Login
							</li>
						)}
					</Link>
				</ul>
			</div>
		</header>
	);
};

export default Header;
