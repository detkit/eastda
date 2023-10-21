import { BrowserRouter, Route, Routes } from 'react-router-dom';

import About from './pages/about';
import Home from './pages/home';
import Profile from './pages/profile';
import Register from './pages/register';
import SignIn from './pages/sign-in';

import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Listing from './pages/Listing';
import CreateListing from './pages/create-listing';
import Search from './pages/search';
import UpdatedListing from './pages/updated-listing';

export default function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<SignIn />} />
				<Route path='/register' element={<Register />} />
				<Route path='/about' element={<About />} />
				<Route path='/search' element={<Search />} />
				<Route path='/listing/:listingId' element={<Listing />} />
				<Route element={<PrivateRoute />}>
					<Route path='/profile' element={<Profile />} />
					<Route path='/create-listing' element={<CreateListing />} />
					<Route
						path='/updated-listing/:listingId'
						element={<UpdatedListing />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
