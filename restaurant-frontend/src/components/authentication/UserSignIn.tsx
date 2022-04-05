/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { FunctionComponent, useRef, useState} from "react";
import {TextField, Typography, Button, Box} from "@mui/material";
import { SectionDivider } from "../shared/SectionDivider";
import { useNavigate } from "react-router-dom";
import { store } from "../../redux/store";
import {GrRestaurant} from "react-icons/gr";

import "./UserSignIn.css";
import { ImageDescriptor } from "../shared/ImageDescriptor";

interface UserSignupProps {

}

export const UserSignIn: FunctionComponent<UserSignupProps> = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState(null);
	const [password, setPassword] = useState(null);
	const [error, setError] = useState(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const goToSignUpPage = () => {
		navigate("/signup");
	};

	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const usernameInputValue = event.target.value;
		setUsername(usernameInputValue);
	};
	
	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const passwordInputValue = event.target.value;
		setPassword(passwordInputValue);
	};

	const navigateToRestaurantPage = () => {
		navigate("/restaurant");
	};

	const handleSignIn = () => {
		store.dispatch({type: "authRequested", onError: onSignInError, callback: navigateToRestaurantPage, params: {username, password}});
	};

	const onSignInError = (message) => {
		setError(message);
	};

	return (
		<div className='base-container'>
			<div className='header-container'>
				<ImageDescriptor icon={<GrRestaurant/>} size='large' alt='icon'></ImageDescriptor>
				<Typography className="restaurant-name" variant="h3" component="h3">
					{"Welcome to Sruthi's Restaurant"}
				</Typography>
			</div>
			<SectionDivider></SectionDivider>
			<Box
				component="form"
				sx={{
					"& .MuiTextField-root": { m: 1, width: "25ch" },
				}}
				noValidate
				autoComplete="off"
				className='signin-box'
			>
				<Typography className="form-error" variant="h6" component="h2">
					{error}
				</Typography>
				<TextField
					required
					id="outlined-signin-email"
					label="Email"
					onChange={handleUsernameChange}
				/>
				<TextField
					required
					id="outlined-signin-password-input"
					label="Password"
					type="password"
					autoComplete="current-password"
					ref={passwordRef}
					onChange={handlePasswordChange}
				/>
				<Button onClick={handleSignIn} variant="contained">Sign In</Button>
				<Button onClick={goToSignUpPage} variant="text">Create an account instead?</Button>
			</Box>
		</div>
	);
};
