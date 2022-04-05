import PropTypes from "prop-types";
import React from "react";
import { RestaurantCard } from "../Main/RestaurantCard";

export const RestaurantList = ({ currentPage, addToCollection, showAddIcon, collections, customFilter }) => {
	if(!currentPage) {
		return <></>;
	}
	return currentPage.map((res) => (
		<RestaurantCard
			key={res.id}
			title={res.title}
			openNow={res.is_open}
			id={res.id}
			addToCollection={addToCollection}
			showAddIcon={showAddIcon}
			collections={collections}
			customFilter={customFilter}
		></RestaurantCard>
	));
};

RestaurantList.propTypes = {
	currentPage: PropTypes.array.isRequired,
	addToCollection: PropTypes.func.isRequired,
	showAddIcon: PropTypes.bool,
	collections: PropTypes.bool.isRequired,
	customFilter: PropTypes.bool.isRequired,
};

RestaurantList.defaultProps = {
	collections: false,
};
