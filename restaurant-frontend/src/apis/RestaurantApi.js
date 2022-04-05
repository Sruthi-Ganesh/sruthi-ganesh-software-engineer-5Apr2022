import {SERVER_URL} from "../utils/RestaurantConstants";
import { AuthenticationFailureError } from "../exceptions/AuthenticationFailureError";
import { getWeekDay, getSeconds } from "../utils/RestaurantUtils";
import { isEmpty } from "lodash";

export const getRestaurants = () => {
	return new Promise((resolve, reject) => {
		fetch(`${SERVER_URL}`)
			.then((response) => response.json())
			.then((responseJson) => resolve(responseJson))
			.catch((message) => reject(message));
	});
};

const getDayAndTime = () => {
	var date = new Date();
	const day = getWeekDay(date.getUTCDay());
	const totalSeconds = getSeconds(date);
	return [day, totalSeconds];
};

export const fetchNextPage = (currentPageNum, token, sortByTitle, filter) => {
	if (!token) {
		Promise.reject("Token does not exist");
	}
	const params = {
		method: "GET",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			"Authorization": `Token ${token}`,
		}
	};
	let {weekDay, time} = filter;
	if (!weekDay || !time) {
		[weekDay, time] = getDayAndTime();
	}
	return new Promise((resolve, reject) => {
		fetch(`${SERVER_URL}res/restaurant/?page=${currentPageNum}&day=${weekDay}&time=${time}&orderbytitle=${sortByTitle}`, params)
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

export const fetchOpenPages = (currentPageNum, token, sortByTitle, filter) => {
	if (!token) {
		Promise.reject("Token does not exist");
	}
	const params = {
		method: "GET",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			"Authorization": `Token ${token}`,
		}
	};
	let {weekDay, time} = filter;
	if (!weekDay || !time) {
		[weekDay, time] = getDayAndTime();
	}
	return new Promise((resolve, reject) => {
		fetch(`${SERVER_URL}search/?page=${currentPageNum}&day=${weekDay}&time=${time}&orderbytitle=${sortByTitle}`, params)
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

export const fetchFilteredRestaurants = (currentPageNum, token, sortByTitle, filter) => {
	if (!token) {
		Promise.reject("Token does not exist");
	}
	const params = {
		method: "GET",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			"Authorization": `Token ${token}`,
		}
	};
	let url;
	const openOnly = filter.openOnly !== 2;
	const {filterValue} = filter;
	const {weekDay, time} = filter;
	if (!isEmpty(filter) && weekDay && time) {
		url = `${SERVER_URL}search/?page=${currentPageNum}&day=${weekDay}&time=${time}&title=${filterValue}&orderbytitle=${sortByTitle}`;
	}
	else if (openOnly) {
		const [day, totalSeconds] = getDayAndTime();
		url = `${SERVER_URL}search/?page=${currentPageNum}&day=${day}&time=${totalSeconds}&title=${filterValue}&orderbytitle=${sortByTitle}`;
	} else {
		url = `${SERVER_URL}search/?page=${currentPageNum}&title=${filterValue}&orderbytitle=${sortByTitle}`;
	}
	return new Promise((resolve, reject) => {
		fetch(url, params)
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

export const saveRestaurantCollections = (restaurantId, collections, token) => {
	const body = {
		method: "PATCH",
		body: JSON.stringify({
			collections,
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			Authorization: `Token ${token}`,
		},
	};
	return new Promise((resolve, reject) => {
		fetch(`${SERVER_URL}res/restaurant/${restaurantId}/`, body)
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

export const searchRestaurants = (title, token) => {
	if (!token) {
		Promise.reject("Token does not exist");
	}
	const params = {
		method: "GET",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			"Authorization": `Token ${token}`,
		}
	};
	return new Promise((resolve, reject) => {
		fetch(`${SERVER_URL}search/suggest/?title=${title}`, params)
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

