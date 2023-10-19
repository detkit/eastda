import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { app } from '../firebase';
import {
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
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

	// firebase to upload image
	// allow read;
	// allow write: if
	// request.resource.size < 2 * 1024 * 1024 &&
	// request.resource.contentType.matches('image/.*')

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

	return (
		<div className='p-3 max-w-lg mx-auto'>
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
					className='rounded-full h-24 self-center mt-2 w-24 object-cover cursor-pointer'
				/>
				<p className='text-md self-center'>
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
					className='border p-3 rounded-lg'
					onChange={handleChange}
				/>
				<input
					type='email'
					placeholder='email'
					id='email'
					defaultValue={currentUser.email}
					className='border p-3 rounded-lg'
					onChange={handleChange}
				/>
				<input
					type='text'
					placeholder='password'
					className='border p-3 rounded-lg'
				/>
				<button
					disabled={loading}
					className='bg-sky-600 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80'
				>
					{loading ? 'Loading...' : 'Updated'}
				</button>
			</form>
			<div className='flex justify-between mt-5'>
				<span
					onClick={handleDeleteAccount}
					className='text-red-700 cursor-pointer'
				>
					Delete Account
				</span>
				<span className='text-red-700 cursor-pointer'>Sign Out</span>
			</div>

			<p className='text-red-700 mt-5'>{error ? error : ''}</p>
			<p className='text-green-700 mt-5'>
				{updateSuccess ? 'User is updated successfully!' : ''}
			</p>
		</div>
	);
}
