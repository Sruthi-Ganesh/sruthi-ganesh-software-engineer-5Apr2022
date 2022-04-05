import {SERVER_URL} from "../utils/RestaurantConstants";

export const signIn = ({username, password}) => {
	const body = {
		method: "POST",
		body: JSON.stringify({
			username,
			password,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	};
	return new Promise((resolve, reject) => {
		fetch(`${SERVER_URL}auth/login/`, body)
			.then((response) => response.json())
			.then((responseJson) => { 
				if (responseJson.error) {
					reject(responseJson.error);
				} else {
					resolve(responseJson);
				}
			})
			.catch((message) => reject(message));
	});
};

export const signOut = (token) => {
	if (!token) {
		Promise.reject("Token does not exist");
	}
	const body = {
		method: "GET",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			"Authorization": `Token ${token}`,
		}
	};
	return new Promise((resolve, reject) => {
		fetch(`${SERVER_URL}auth/logout/`, body)
			.then((response) => response.json())
			.then((responseJson) => { 
				if (responseJson.error) {
					reject(responseJson.error);
				} else {
					resolve(responseJson);
				}
			})
			.catch((message) => reject(message));
	});
};


export const register = (username, password, firstName, lastName) => {
	const body = {
		method: "POST",
		body: JSON.stringify({
			email: username,
			password,
			first_name: firstName,
			last_name: lastName,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	};
	return new Promise((resolve, reject) => {
		fetch(`${SERVER_URL}auth/register/`, body)
			.then((response) => response.json())
			.then((responseJson) => { 
				if (responseJson.error) {
					reject(responseJson.error);
				} else {
					resolve(responseJson);
				}
			})
			.catch((message) => reject(message));
	});
};
