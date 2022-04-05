import "regenerator-runtime/runtime";
import { call, put, select, all, fork, takeLatest } from "redux-saga/effects";
import {fetchNextPage, fetchOpenPages, fetchFilteredRestaurants} from "../apis/RestaurantApi";
import { signIn } from "../apis/authenticationApi";
import { getAllCollections } from "../apis/CollectionApi";
import { getPageByNo } from "../utils/RestaurantUtils";
import {AuthenticationFailureError} from "../exceptions/AuthenticationFailureError";
import {isEmpty} from "lodash";

function* fetchPage(action) {
	try {
		const {pages, authToken, filter} = yield select();
		let filterPayload = filter;
		if (!isEmpty(action.filter)) {
			filterPayload = action.filter;
		}
		const {sortByTitle, filterValue, weekDay, time} = filterPayload;
		const openOnly = filterPayload.openOnly !== 2;
		//skip fetching pages from API if the page is already loaded into redux
		let page = getPageByNo(pages, action.pageNum, filterValue, openOnly, weekDay, time, sortByTitle);
		if (page) {
			if (page.total_pages > 0)
				yield put({type: "paginationPages", payload: page.total_pages, pageNum: action.pageNum, weekDay, time});
			return;
		}
		let newPages;
		yield put({type: "loading", payload: true});
		if (filterValue) {
			newPages = yield call(fetchFilteredRestaurants, action.pageNum, authToken, sortByTitle, filterPayload);
		} else {
			const method = openOnly == false ? fetchNextPage : fetchOpenPages;
			newPages = yield call(method, action.pageNum, authToken, sortByTitle, filterPayload);
		}
		yield put({type: "pages", payload: newPages, pageNum: action.pageNum, filter: filterPayload});
		if (newPages.total_pages > 0)
			yield put({type: "paginationPages", payload: newPages.total_pages, pageNum: action.pageNum});
		yield put({type: "loading", payload: false});
	}
	catch (error) {
		console.log(error);
		if (error instanceof AuthenticationFailureError) {
			yield call(action.authenticationFailureCallback);
		}
	}
}

function* login(action) {
	try {
		const response = yield call(signIn, action.params);
		yield put({type: "authToken", payload: response.token});
		yield put({type: "displayName", payload: response.display_name});
		yield put({type: "loginSuccess"});
		yield call(action.callback);
	} catch (error) {
		yield put({type: "loginFailure"});
		yield call(action.onError, error);
	}
}

function* fetchCollections(action) {
	try {
		const response = yield call(getAllCollections, action.token);
		yield put({type: "setCollections", payload: response});
		yield put({type: "collectionsSuccess"});
	} catch (error) {
		console.log(error);
	}
}


function* mySaga() {
	yield takeLatest("currentPageNo", fetchPage);
}

function* filterSaga() {
	yield takeLatest("filter", fetchPage);
}

function* loginSaga() {
	yield takeLatest("authRequested", login);
}

function* collectionSaga() {
	yield takeLatest("collectionsRequested", fetchCollections);
}

export function* rootSaga() {
	yield all([fork(mySaga), fork(loginSaga), fork(collectionSaga), fork(filterSaga)]);
}
