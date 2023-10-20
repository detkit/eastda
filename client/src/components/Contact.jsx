import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
	const [landLord, setLandLord] = useState(null);
	const [message, setMessage] = useState('');

	useEffect(() => {
		const fetchLandlord = async () => {
			try {
				const res = await fetch(`/api/user/${listing.userRef}`);
				const data = await res.json();
				setLandLord(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchLandlord();
	}, [listing.userRef]);

	const handleMessage = (e) => {
		setMessage(e.target.value);
	};

	return (
		<>
			{landLord && (
				<div className='flex flex-col gap-2'>
					<p>
						Contact{' '}
						<span className='font-semibold'>
							{landLord.username}
						</span>{' '}
						for{' '}
						<span className='font-semibold'>
							{listing.name.toLowerCase()}
						</span>
					</p>
					<textarea
						name='message'
						id='message'
						rows='2'
						value={message}
						onChange={handleMessage}
						placeholder='Your Message here...'
						className='w-full p-3 border rounded-lg'
					></textarea>

					<Link
						to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}
						className='p-3 text-center text-white uppercase rounded-lg bg-slate-700 hover:opacity-95'
					>
						Send Message
					</Link>
				</div>
			)}
		</>
	);
};

export default Contact;
