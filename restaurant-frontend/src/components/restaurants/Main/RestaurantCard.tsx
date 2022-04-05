import PropTypes from "prop-types";
import * as React from "react";

import "./RestaurantCard.css";
import { MenuDivider } from "../../shared/MenuDivider";
import { ImageDescriptor } from "../../shared/ImageDescriptor";
import {GrAdd} from "react-icons/gr";

export const RestaurantCard = ({title, openNow, customFilter, addToCollection, id, showAddIcon, collections}) => {
	const OPEN_TEXT = customFilter ? "Open" : "Open Now";
	return (
		<div className={collections || openNow ? "restaurant-card card-open" : "restaurant-card"}>
			<MenuDivider>
				<MenuDivider.MenuLeftDivider className='header'>{title}</MenuDivider.MenuLeftDivider>
				<MenuDivider.MenuRightDivider>
					{showAddIcon && <ImageDescriptor icon={<GrAdd className='add-icon' onClick={() => addToCollection(id)}/>} text=''></ImageDescriptor>}
				</MenuDivider.MenuRightDivider>
			</MenuDivider>
			<MenuDivider>
				{!collections && <MenuDivider.MenuLeftDivider className={openNow ? "green-item": "greyed-out-item"}>{openNow ? OPEN_TEXT : "Closed"}</MenuDivider.MenuLeftDivider>}
			</MenuDivider>
		</div>
	);
};

RestaurantCard.propTypes = {
	title: PropTypes.string.isRequired,
	openNow: PropTypes.bool.isRequired,
	addToCollection: PropTypes.func.isRequired,
	id: PropTypes.number.isRequired,
	showAddIcon: PropTypes.bool,
	collections: PropTypes.bool.isRequired,
	customFilter: PropTypes.bool.isRequired,
};

RestaurantCard.defaultProps = {
	showAddIcon: true,
};
