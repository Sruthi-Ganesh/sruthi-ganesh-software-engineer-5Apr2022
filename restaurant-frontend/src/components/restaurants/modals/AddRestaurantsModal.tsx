/* eslint-disable no-mixed-spaces-and-tabs */
import PropTypes from "prop-types";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField, Menu, MenuItem } from "@mui/material";
import { searchRestaurants } from "../../../apis/RestaurantApi";
import { throttle } from "lodash";
import { store } from "../../../redux/store";
import { SectionDivider } from "../../shared/SectionDivider";
import { IoClose } from "react-icons/io5";

export const AddRestaurantsModal = ({ open, handleClose, onSave }) => {
	const [error, setError] = useState("");
	const [restaurants, setRestaurants] = useState([]);
	const [selectedRestaurants, setSelectedRestaurants] = useState([]);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLInputElement>(null);
	const handleMenuClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAnchorEl(event.target);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = (res) => {
		setAnchorEl(null);
		const newRestaurants = [...selectedRestaurants];
		newRestaurants.push(res);
		setSelectedRestaurants(newRestaurants);
	};

	const handleRemoveMenuItem = (res) => {
		const newRestaurants = [...selectedRestaurants];
		let resIndex = -1;
		newRestaurants.forEach((element, index) => {
			if (element.id === res.id) {
				resIndex = index;
			}
		});
		if (resIndex ===  -1) {
			return;
		}
		newRestaurants.splice(resIndex, 1);
		setSelectedRestaurants(newRestaurants);
	};

	const searchRestaurantsThrottled = throttle(searchRestaurants, 3000);

	const handleTitleChange = (
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		const titleValue = event.target.value;
		const { authToken } = store.getState();
		searchRestaurantsThrottled(titleValue, authToken).then(
			(searchedRestaurants) => {
				setRestaurants(searchedRestaurants.results);
				if (
					searchedRestaurants.results &&
          			searchedRestaurants.results.length > 0
				)
					handleMenuClick(event);
			}
		);
	};

	const saveRestaurants = () => {
		if (selectedRestaurants.length === 0) {
			setError("Select atleast one restaurant");
			return;
		}
		const ids = [];
		selectedRestaurants.forEach((res) => ids.push(res.id));
		onSave(ids);
		setSelectedRestaurants([]);
	};

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="add-collection-modal">
					<Typography className="modal-modal-error" variant="h6" component="h2">
						{error}
					</Typography>
					<Typography className="modal-modal-title" variant="h3" component="h3">
            			Add restaurants
					</Typography>
					<SectionDivider />
					<div className="modal-body">
						<TextField
							required
							id="outlined-collection-title"
							label="Search for restaurants to add"
							onChange={handleTitleChange}
						/>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
							MenuListProps={{
								"aria-labelledby": "basic-button",
							}}
						>
							{restaurants &&
                restaurants.map((res) => (
                	<MenuItem
                		key={res.id}
                		onClick={() => handleMenuItemClick(res)}
                	>
                		{res.title}
                	</MenuItem>
                ))}
						</Menu>
					</div>
					<SectionDivider />
					{selectedRestaurants &&
            selectedRestaurants.map((res) => (
            	<Button
            		key={res.id}
            		variant="outlined"
            		endIcon={<IoClose onClick={() => handleRemoveMenuItem(res)} />}
            	>
            		{res.title}
            	</Button>
            ))}
					<SectionDivider />
					<div className="modal-actions">
						<Button onClick={saveRestaurants}>Add</Button>
						<Button onClick={handleClose}>Cancel</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};
AddRestaurantsModal.propTypes = {
	open: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
};
