import { getPageKey } from "../utils/RestaurantUtils";

export const reducers = (
	state = {
		currentPageNo: 1,
		pages: {},
		totalPages: 0,
		authToken: null,
		authStatus: 0,
		loginRequest: 0,
		collectionRequest: 0,
		openOnly: true,
		mainPageUrl: "restaurant",
		loadingCollections: false,
		displayName: null,
		filter: {openOnly: 1, weekDay: null, time: null, filterValue: null, sortByTitle: false},
	},
	action
) => {
	switch (action.type) {
	case "currentPageNo":
		return { ...state, currentPageNo: action.pageNum };
	case "pages": {
		let { pages } = state;
		const {filterValue, openOnly, weekDay, time, sortByTitle} = action.filter;
		let pageKey = getPageKey(
			action.pageNum,
			filterValue,
			openOnly !== 2,
			weekDay,
			time,
			sortByTitle
		);
		pages[pageKey] = action.payload;
		return { ...state, ...pages };
	}
	case "paginationPages":
		return {
			...state,
			totalPages: action.payload === null ? 0 : action.payload,
		};
	case "loading":
		return { ...state, isLoading: action.payload };
	case "authToken":
		return { ...state, authToken: action.payload };
	case "loginSuccess":
		return { ...state, authStatus: 2 };
	case "loginFailure":
		return { ...state, authStatus: 1 };
	case "authRequested":
		return { ...state, loginRequest: 1 };
	case "authComplete":
		return { ...state, loginRequest: 0 };
	case "collectionsRequested":
		return { ...state, collectionRequest: 1, loadingCollections: true };
	case "collectionsSuccess":
		return { ...state, collectionRequest: 0, loadingCollections: false  };
	case "setCollections":
		return { ...state, collections: action.payload };
	case "mainPageUrl":
		return { ...state, mainPageUrl: action.payload };
	case "displayName":
		return { ...state, displayName: action.payload };
	case "filter":
		return {...state, filter: action.filter, currentPageNo: action.pageNum };
	default:
		return state;
	}
};
