import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { logInSuccess } from '../redux/user/userSlice';

const OAuth = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const auth = getAuth(app);

			const result = await signInWithPopup(auth, provider);

			const res = await fetch('/api/auth/google', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: result.user.displayName,
					email: result.user.email,
					photo: result.user.photoURL,
				}),
			});
			const data = await res.json();
			dispatch(logInSuccess(data));
			navigate('/');
		} catch (error) {
			console.log('could not login with google');
		}
	};

	return (
		<button
			onClick={handleLogGoogle}
			type='button'
			className='p-3 text-white uppercase bg-red-600 rounded-lg hover:opacity-95'
		>
			continue with google
		</button>
	);
};

export default OAuth;
