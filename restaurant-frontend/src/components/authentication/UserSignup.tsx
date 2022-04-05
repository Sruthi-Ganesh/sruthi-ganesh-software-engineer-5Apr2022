/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { FunctionComponent, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { SectionDivider } from "../shared/SectionDivider";
import { useNavigate } from "react-router-dom";
import { register } from "../../apis/authenticationApi";
import {GrRestaurant} from "react-icons/gr";

import "./UserSignup.css";
import { ImageDescriptor } from "../shared/ImageDescriptor";

interface UserSignupProps {}

export const UserSignup: FunctionComponent<UserSignupProps> = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
	const [confirmPassword, setConfirmPassword] = useState(null);
	const [firstName, setFirstName] = useState(null);
	const [lastName, setLastName] = useState(null);
	const [errors, setErrors] = useState({});

	const goToSignInPage = () => {
		navigate("/");
	};

	const handleSignUp = () => {
		if (validateAll()) {
			register(email, password, firstName, lastName)
				.then(() => {
					goToSignInPage();
					setErrors([]);
				})
				.catch((error) => {
					setErrors({ ...errors, authentication: error });
				});
		}
	};

	const validateAll = () => {
		return (
			validatePassword(password) &&
			validateConfirmPassword(confirmPassword) &&
			validateFirstName(firstName) &&
			validateLastName(lastName) &&
			validateEmail(email)
		);
	};

	const handleFirstNameChange = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	): void => {
		const inputValue = event.target.value;
		setFirstName(inputValue);
		validateFirstName(inputValue);
	};

	const handleLastNameChange = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	): void => {
		const inputValue = event.target.value;
		setLastName(inputValue);
		validateLastName(inputValue);
	};

	const handleEmail = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	): void => {
		const emailInputValue = event.target.value;
		setEmail(emailInputValue);
		validateEmail(emailInputValue);
	};

	const handleConfirmPassword = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	): void => {
		const passwordInputValue = event.target.value;
		setConfirmPassword(passwordInputValue);
		validateConfirmPassword(passwordInputValue);
	};

	const handlePassword = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	): void => {
		const passwordInputValue = event.target.value;
		setPassword(passwordInputValue);
		validatePassword(passwordInputValue);
	};

	const validatePassword = (password) => {
		if (!password || password.length < 8) {
			setErrors({
				...errors,
				password: "Password should be atleast 8 characters",
			});
			return false;
		}
		setErrors({ ...errors, password: null });
		return true;
	};

	const validateConfirmPassword = (confirmPassword) => {
		if (!confirmPassword || !password || confirmPassword !== password) {
			setErrors({ ...errors, confirmPassword: "Password is not matching" });
			return false;
		}
		setErrors({ ...errors, confirmPassword: null });
		return true;
	};

	const validateFirstName = (firstName) => {
		if (!firstName) {
			setErrors({ ...errors, firstName: "First Name should not be empty" });
			return false;
		}
		setErrors({ ...errors, firstName: null });
		return true;
	};

	const validateLastName = (lastName) => {
		if (!lastName) {
			setErrors({ ...errors, lastName: "Last Name should not be empty" });
			return false;
		}
		setErrors({ ...errors, lastName: null });
		return true;
	};

	const validateEmail = (email) => {
		if (!email ||
			!email.match(
				/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		) {
			setErrors({ ...errors, email: "Email is not valid" });
			return false;
		}
		setErrors({ ...errors, email: null });
		return true;
	};

	return (
		<div className="base-container">
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
				className="signup-box"
			>
				<Typography className="form-error" variant="h6" component="h2">
					{Object.values(errors).map((error) => {
						if (error) {
							return <div>{error}</div>;
						}
					})}
				</Typography>
				<TextField
					required
					id="first-name"
					label="First Name"
					onChange={(e) => handleFirstNameChange(e)}
				/>
				<TextField
					required
					id="last-name"
					label="Last Name"
					onChange={(e) => handleLastNameChange(e)}
				/>
				<TextField
					required
					id="email"
					label="Email"
					type="email"
					onChange={(e) => handleEmail(e)}
				/>
				<TextField
					required
					id="outlined-password-input"
					label="Password"
					type="password"
					autoComplete="current-password"
					onChange={(e) => handlePassword(e)}
				/>
				<TextField
					required
					id="outlined-confirm-password-input"
					label="Confirm password"
					type="password"
					autoComplete="current-password"
					onChange={(e) => handleConfirmPassword(e)}
				/>
				<Button onClick={handleSignUp} variant="contained">
          Sign Up
				</Button>
				<Button onClick={goToSignInPage} variant="text">
          Continue to Sign in instead?
				</Button>
			</Box>
		</div>
	);
};
