import PropTypes from "prop-types";
import React, {useEffect} from "react";
import {Search} from "../../search/Search";
import {store} from "../../../redux/store";
import { useNavigate } from "react-router-dom";

import "./Restaurant.css";
import { RestaurantList } from "./RestaurantList";
import { Pagination } from "../../Pagination/Pagination";

export const Restaurant = ({currentPage, loading, openOnly, addToCollection, customFilter}) => {

	const navigate = useNavigate();

	const goToSignInPage = () => {
		navigate("/");
	};

	const onValueFilter = (value, filter, weekDay, time, sort) => {
		if (filter !== 3) {
			store.dispatch({type: "filter", authenticationFailureCallback: goToSignInPage, pageNum: 1, filter: {openOnly: filter, weekDay: null, time: null, filterValue: value, sortByTitle: sort}});
		} else {
			store.dispatch({type: "filter", authenticationFailureCallback: goToSignInPage, pageNum: 1, filter: {openOnly: filter, weekDay, time, filterValue: value, sortByTitle: sort}});
		}
	};

	const onOpenClick = (openValue) => {
		store.dispatch({type: "openOnly", payload: openValue});
		store.dispatch({type: "currentPageNo", authenticationFailureCallback: goToSignInPage, pageNum: 1});
	};

	useEffect(() => {
		store.dispatch({type: "currentPageNo", authenticationFailureCallback: goToSignInPage, pageNum: 1});
	}, []);

	return (<div className='restaurant-container'>
		<Search className='restaurant-search' onValueFilter={onValueFilter} onOpenClick={onOpenClick}></Search>
		{!currentPage || loading ? (
			<div className='restaurant-loading-container'> Page is loading... Please wait </div>
		) : (<div className='restaurant-list-container'>
			<RestaurantCount className='count-container' totalNum={currentPage ? currentPage.total_objects : 0} openOnly={openOnly}></RestaurantCount>
			<RestaurantList customFilter={customFilter} addToCollection={addToCollection} currentPage={currentPage.results}></RestaurantList>
			<Pagination></Pagination>
		</div>
		)}

	</div>);
};

const RestaurantCount = ({totalNum, className, openOnly}) => {
	return (<div className={className}>{openOnly ? `${totalNum} restaurants are open now` : `${totalNum} restaurants found`}</div>);
};
RestaurantCount.propTypes = {
	totalNum: PropTypes.number.isRequired,
	className: PropTypes.string,
	openOnly: PropTypes.bool.isRequired,
};
RestaurantCount.defaultProps = {
	className: "",
};
Restaurant.propTypes = {
	currentPage: PropTypes.object,
	loading: PropTypes.bool,
	openOnly: PropTypes.bool.isRequired,
	addToCollection: PropTypes.func.isRequired,
	customFilter: PropTypes.bool.isRequired,
};
