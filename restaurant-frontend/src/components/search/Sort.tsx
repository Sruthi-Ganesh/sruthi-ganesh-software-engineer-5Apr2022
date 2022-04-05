import PropTypes from "prop-types";
import React from "react";
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { SORT_OPTIONS} from "../../utils/RestaurantConstants"; 

export const Sort = ({sort, handleSortChange}) => {
	return (
		<FormControl>
			<InputLabel id="sort-input-label">Sort By</InputLabel>
			<Select
				labelId="sort-select-label"
				id="sort-select"
				value={sort}
				label="Sort By"
				onChange={handleSortChange}
			>
				{Object.entries(SORT_OPTIONS).map(([key, value]) => (
					<MenuItem key={key} value={key}>
						{value}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

Sort.propTypes = {
	sort: PropTypes.number.isRequired,
	handleSortChange: PropTypes.func.isRequired, 
};
