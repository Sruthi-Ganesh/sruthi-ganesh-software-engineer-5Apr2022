import PropTypes from "prop-types";
import React from "react";
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { FILTER_OPTIONS, WEEKDAY} from "../../utils/RestaurantConstants";
import {getTimeRanges} from "../../utils/RestaurantUtils";

import "./Filter.css";

export const Filter = ({filter, handleFilterChange, weekDay, handleWeekDayChange, time, handleTimeChange}) => {
	const TIME = getTimeRanges();

	return (
		<div className='filter-input'>
			<FormControl>
				<InputLabel id="filter-input-label">Filter By</InputLabel>
				<Select
					labelId="filter-select-label"
					id="filter-select"
					value={filter}
					label="Filter"
					onChange={handleFilterChange}
				>
					{Object.entries(FILTER_OPTIONS).map(([key, value]) => (
						<MenuItem key={key} value={key}>
							{value}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{filter === 3 && (
				<>
					<FormControl>
						<InputLabel id="weelday-select-label">Open on</InputLabel>
						<Select
							labelId="weekday-select-label"
							id="weekday-select"
							value={weekDay}
							label="Open on"
							onChange={handleWeekDayChange}
						>
							{Object.entries(WEEKDAY).map(([key, value]) => (
								<MenuItem key={key} value={key}>
									{value}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl>
						<InputLabel id="time-select-label">Open at</InputLabel>
						<Select
							labelId="time-select-label"
							id="time-select"
							value={time}
							label="Open at"
							onChange={handleTimeChange}
						>
							{TIME.map((time) => (
								<MenuItem key={time.time} value={time.time}>
									{time.time}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</>
			)}
		</div>
	);
};
Filter.propTypes = {
	filter: PropTypes.number.isRequired,
	handleFilterChange: PropTypes.func.isRequired, 
	weekDay: PropTypes.number.isRequired, 
	handleWeekDayChange: PropTypes.func.isRequired, 
	time: PropTypes.string.isRequired, 
	handleTimeChange: PropTypes.func.isRequired, 
};
