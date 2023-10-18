import { BrowserRouter, Route, Routes } from 'react-router-dom';

import About from './pages/about';
import Home from './pages/home';
import Profile from './pages/profile';
import Register from './pages/register';
import SignIn from './pages/sign-in';

import Header from './components/Header';

export default function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<SignIn />} />
				<Route path='/register' element={<Register />} />
				<Route path='/about' element={<About />} />
				<Route path='/profile' element={<Profile />} />
			</Routes>
		</BrowserRouter>
	);
}
