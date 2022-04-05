
import React from "react"; 
import "./App.css";
import {UserSignIn, UserSignup,} from "./components";
import { Routes, Route, Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import {RestaurantApp} from "./components/restaurants/sidebar/RestaurantApp";

function App() {
	return (
		<BrowserRouter>
			<div className="App">
				<Routes>
					<Route exact path="/" element={<UserSignIn/>} />
					<Route exact path="/signup" element={<UserSignup/>} />
					<Route exact path="/restaurant" element={<RestaurantApp/>} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
