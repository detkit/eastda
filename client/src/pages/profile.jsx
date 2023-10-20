import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { app } from '../firebase';
import {
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	signOutUserFailure,
	signOutUserStart,
	signOutUserSuccess,
	updateUserFailure,
	updateUserStart,
	updateUserSuccess,
} from '../redux/user/userSlice';

export default function Profile() {
	const imgRef = useRef(null);
	const { currentUser, loading, error } = useSelector((state) => state.user);
	const [file, setFile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [formData, setFormData] = useState({});
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file]);

	const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
			},
			(error) => {
				setFileUploadError(true);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
					setFormData({ ...formData, avatar: downloadURL })
				);
			}
		);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(updateUserStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
				return;
			}

			dispatch(updateUserSuccess(data));
			setUpdateSuccess(true);
		} catch (error) {
			dispatch(updateUserFailure(error.message));
		}
	};

	const handleDeleteAccount = async () => {
		try {
			dispatch(deleteUserStart());

			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: 'DELETE',
			});

			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}

			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};

	const handleSignOut = async () => {
		try {
			dispatch(signOutUserStart());
			const res = await fetch(`/api/auth/signout`);

			const data = await res.json();
			if (data.success === false) {
				dispatch(signOutUserFailure(data.message));
				return;
			}

			dispatch(signOutUserSuccess(data));
		} catch (error) {
			dispatch(signOutUserFailure(error.message));
		}
	};

	return (
		<div className='max-w-lg p-3 mx-auto'>
			<h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<input
					onChange={(e) => setFile(e.target.files[0])}
					type='file'
					ref={imgRef}
					hidden
					accept='image/*'
				/>
				<img
					onClick={() => imgRef.current.click()}
					src={formData?.avatar || currentUser.avatar}
					alt='avatar'
					className='self-center object-cover w-24 h-24 mt-2 rounded-full cursor-pointer'
				/>
				<p className='self-center text-md'>
					{fileUploadError ? (
						<span className='text-red-700'>
							Error Image Upload (image must be less than 2 mb)
						</span>
					) : filePerc > 0 && filePerc < 100 ? (
						<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
					) : filePerc === 100 ? (
						<span className='text-green-700'>
							Image Successfully Uploaded!
						</span>
					) : (
						''
					)}
				</p>
				<input
					type='text'
					placeholder='username'
					id='username'
					defaultValue={currentUser.username}
					className='p-3 border rounded-lg'
					onChange={handleChange}
				/>
				<input
					type='email'
					placeholder='email'
					id='email'
					defaultValue={currentUser.email}
					className='p-3 border rounded-lg'
					onChange={handleChange}
				/>
				<input
					type='text'
					placeholder='password'
					className='p-3 border rounded-lg'
				/>
				<button
					disabled={loading}
					className='p-3 text-white uppercase rounded-lg bg-sky-600 hover:opacity-90 disabled:opacity-80'
				>
					{loading ? 'Loading...' : 'Updated'}
				</button>
				<Link
					to='/create-listing'
					className='p-3 text-center text-white uppercase bg-green-700 rounded-lg hover:opacity-95'
				>
					Create Listing
				</Link>
			</form>
			<div className='flex justify-between mt-5'>
				<span
					onClick={handleDeleteAccount}
					className='text-red-700 cursor-pointer'
				>
					Delete Account
				</span>
				<span
					onClick={handleSignOut}
					className='text-red-700 cursor-pointer'
				>
					Sign Out
				</span>
			</div>

			<p className='mt-5 text-red-700'>{error ? error : ''}</p>
			<p className='mt-5 text-green-700'>
				{updateSuccess ? 'User is updated successfully!' : ''}
			</p>
		</div>
	);
}
