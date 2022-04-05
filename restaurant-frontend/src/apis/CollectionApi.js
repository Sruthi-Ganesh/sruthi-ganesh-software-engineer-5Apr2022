import { SERVER_URL } from "../utils/RestaurantConstants";
import { AuthenticationFailureError } from "../exceptions/AuthenticationFailureError";

export const setNewCollection = (title, token) => {
	const body = {
		method: "POST",
		body: JSON.stringify({
			title,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			Authorization: `Token ${token}`,
		},
	};
	return new Promise((resolve, reject) => {
		fetch(`${SERVER_URL}res/collections/`, body)
			.then((response) => {
				if (response.status === 401) {
					throw new AuthenticationFailureError("Token is invalid");
				} else if (response.status !== 200 && response.status !== 201) {
					return new Error("Unexpected error occurred");
				}
				return response.json();
			})
			.then((responseJson) => resolve(responseJson))
			.catch((message) => reject(message));
	});
};

export const getAllCollections = (token) => {
	const body = {
		method: "GET",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			Authorization: `Token ${token}`,
		},
	};
	return new Promise((resolve, reject) => {
		fetch(`${SERVER_URL}res/collections/`, body)
			.then((response) => {
				if (response.status === 401) {
					throw new AuthenticationFailureError("Token is invalid");
				} else if (response.status !== 200 && response.status !== 201) {
					return new Error("Unexpected error occurred");
				}
				return response.json();
			})
			.then((responseJson) => resolve(responseJson))
			.catch((message) => reject(message));
	});
};

export const saveCollection = (collectionId, restaurants, token) => {
	const body = {
		method: "PATCH",
		body: JSON.stringify({
			restaurants,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			Authorization: `Token ${token}`,
		},
	};
	return new Promise((resolve, reject) => {
		fetch(`${SERVER_URL}res/collections/${collectionId}/`, body)
			.then((response) => {
				if (response.status === 401) {
					throw new AuthenticationFailureError("Token is invalid");
				} else if (response.status !== 200 && response.status !== 201) {
					return new Error("Unexpected error occurred");
				}
				return response.json();
			})
			.then((responseJson) => resolve(responseJson))
			.catch((message) => reject(message));
	});
};
