import PropTypes from "prop-types";
import React, {useEffect} from "react";
import {store} from "../../redux/store";
import { useNavigate } from "react-router-dom";

import "./RestaurantCollection.css";
import { RestaurantList } from "../restaurants/Main/RestaurantList";
import {Typography, Menu, MenuItem} from "@mui/material";
import { SectionDivider } from "../shared/SectionDivider";
import {FaEllipsisV} from "react-icons/fa";
import { ImageDescriptor } from "../shared/ImageDescriptor";

export const RestaurantCollection = ({currentPage, loading, openOnly, handleAddRestaurantsModalOpen, customFilter}) => {

	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = React.useState<null | SVGElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<SVGElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = () => {
		setAnchorEl(null);
		handleAddRestaurantsModalOpen();
	};

	const goToSignInPage = () => {
		navigate("/");
	};

	useEffect(() => {
		store.dispatch({type: "currentPageNo", authenticationFailureCallback: goToSignInPage, pageNum: 1});
	}, []);

	return (<div className='restaurant-collection-container'>
		<div className="restaurant-collection-header">
			<Typography className="modal-modal-title" variant="h3" component="h3">
				{currentPage.title}
			</Typography>
			<ImageDescriptor icon={<FaEllipsisV onClick={handleClick} className='ellipsis-icon'/>}></ImageDescriptor>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				<MenuItem onClick={handleMenuItemClick}>Add Restaurants</MenuItem>
			</Menu>
		</div>
		<SectionDivider/>
		{!currentPage || loading ? (
			<div className='restaurant-collection-loading-container'> Page is loading... Please wait </div>
		) : (<div className='restaurant-collection-list-container'>
			<RestaurantCount className='count-container' totalNum={currentPage ? currentPage.total_objects : 0} openOnly={openOnly}></RestaurantCount>
			<RestaurantList customFilter={customFilter} collections={true} showAddIcon={false} currentPage={currentPage.results}></RestaurantList>
		</div>
		)}

	</div>);
};

const RestaurantCount = ({totalNum, className, openOnly}) => {
	return (<div className={className}>{openOnly ? `${totalNum} restaurants are in this collection` : `${totalNum} restaurants found`}</div>);
};
RestaurantCount.propTypes = {
	totalNum: PropTypes.number.isRequired,
	className: PropTypes.string,
	openOnly: PropTypes.bool.isRequired,
};
RestaurantCount.defaultProps = {
	className: "",
};
RestaurantCollection.propTypes = {
	currentPage: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	openOnly: PropTypes.bool.isRequired,
	handleAddRestaurantsModalOpen: PropTypes.func.isRequired,
	customFilter: PropTypes.bool.isRequired,
};
