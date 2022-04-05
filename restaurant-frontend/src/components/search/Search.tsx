import PropTypes from "prop-types";
import React, { useState, createRef } from "react";
import SearchIcon from "../../images/search.svg";
import { ImageDescriptor } from "../shared/ImageDescriptor";
import { Box, Stack, SelectChangeEvent } from "@mui/material";
import { getTimeRanges } from "../../utils/RestaurantUtils";
import { getSeconds, getWeekDay } from "../../utils/RestaurantUtils";
import {BiSearch} from "react-icons/bi";

import "./Search.css";
import { Filter } from "./Filter";
import { Sort } from "./Sort";

export const Search = ({
	className,
	onValueFilter,
}) => {
	const textFieldRef: any = createRef();
	const TIME = getTimeRanges();

	const [filter, setFilter] = useState(1);
	const [weekDay, setWeekDay] = useState(1);
	const [time, setTime] = useState(TIME[0].time);
	const [sort, setSort] = useState(1);

	const handleFilterResult = () => {
		const filterValue = textFieldRef.current.value;
		const timeValue = TIME.find((t) => t.time === time);
		onValueFilter(filterValue, filter, getWeekDay(weekDay), getSeconds(timeValue.date), sort === 2);
	};

	const handleFilterChange = (event: SelectChangeEvent) => {
		const filterNum = parseInt(event.target.value);
		setFilter(filterNum);
	};

	const handleWeekDayChange = (event: SelectChangeEvent) => {
		setWeekDay(parseInt(event.target.value));
	};

	const handleTimeChange = (event: SelectChangeEvent) => {
		setTime(event.target.value as string);
	};

	const handleSortChange = (event: SelectChangeEvent) => {
		setSort(parseInt(event.target.value));
	};

	return (
		<div className={`search-container ${className}`}>
			<div className="search-input-container">
				<ImageDescriptor
					className="search-icon"
					icon={<BiSearch/>}
					alt="Search"
				></ImageDescriptor>
				<input
					data-testid="search-text-box-input"
					ref={textFieldRef}
					placeholder="Search for Restaurant title"
					className="search-text-box"
					type="text"
					name="name"
				/>
			</div>
			<Box className="open-now-box">
				<Stack className="open-now-stack" direction="row" spacing={1}>
					<Filter
						filter={filter}
						handleFilterChange={handleFilterChange}
						weekDay={weekDay}
						handleWeekDayChange={handleWeekDayChange}
						time={time}
						handleTimeChange={handleTimeChange}
					></Filter>
					<Sort sort={sort} handleSortChange={handleSortChange}></Sort>
				</Stack>
			</Box>
			<button
				data-testid="search-button-on-filter"
				onClick={handleFilterResult}
				className="filter-button"
			>
        Filter Results
			</button>
		</div>
	);
};
Search.propTypes = {
	className: PropTypes.string,
	onValueFilter: PropTypes.func.isRequired,
};
Search.defaultProps = {
	className: "",
};
