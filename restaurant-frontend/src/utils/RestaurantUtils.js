import { WEEKDAY } from "./RestaurantConstants";
// In case we need to cache the page values in local storage, we can use these methods.
export const getPageByNo = (pages, currentPageNo, filteredValue=null, openOnly=true, weekDay=null, time=null, sortByTitle=false) => {
	const pageKey = getPageKey(currentPageNo, filteredValue, openOnly, weekDay, time, sortByTitle);
	if (pages && Object.keys(pages).includes(pageKey)) {
		return pages[pageKey];
	}
	return null;
};

export const getPageKey = (currentPageNo, filteredValue, openValue, weekDay, time, sortByTitle) => {
	const pageNoString = currentPageNo.toString();
	const pageKey =  filteredValue ? `${pageNoString}-${filteredValue.toLowerCase()}` : pageNoString;
	const openKey = openValue === false ? `${pageKey}-all` : pageKey;
	const timeKey = weekDay && time  ? `${openKey}-${weekDay}-${time}` : openKey;
	return sortByTitle ? `${timeKey}-sort` : timeKey;
};

export const getTimeRanges = () => {
	const ranges = [];
	const date = new Date();
	const format = {
		hour: "numeric",
		minute: "numeric",
	};

	for (let minutes = 0; minutes < 24 * 60; minutes = minutes + 15) {
		date.setHours(0);
		date.setMinutes(minutes);
		ranges.push({"date": date, "time": date.toLocaleTimeString("en", format)});
	}

	return ranges;
};

export const getWeekDay = (number) => {
	return WEEKDAY[number];
};

export const getSeconds = (date) => {
	const [hours, minutes, seconds] = date.toISOString().split("T")[1].slice(0, 8).split(":");
	return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
};
