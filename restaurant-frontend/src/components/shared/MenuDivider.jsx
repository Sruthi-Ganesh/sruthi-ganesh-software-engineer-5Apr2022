import PropTypes from "prop-types";
import React from "react";
import { ImageDescriptor } from "../shared/ImageDescriptor";


import "./MenuDivider.css";

export const MenuDivider = (props) => (
	<div data-testid='menu-divider-container' className={`menu-divider-container ${props.separatedType}`}>{props.children}</div>
);

MenuDivider.propTypes = {
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([
		PropTypes.shape({
			type: PropTypes.oneOf([MenuLeftDivider]),
		}),
		PropTypes.shape({
			type: PropTypes.oneOf([MenuRightDivider]),
		}),
		PropTypes.node,
	])),MenuLeftDivider, MenuRightDivider]),
	separatedType: PropTypes.oneOf(["separate", "immediate"])
};

MenuDivider.defaultProps = {
	separatedType: "separate",
};

const MenuLeftDivider = (props) => (
	<div data-testid='menu-left-divider' className={`left-divider ${props.className}`}>{props.children}</div>
);

MenuLeftDivider.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.shape({
			type: PropTypes.oneOf([ImageDescriptor]),
		}),
		PropTypes.node,
	]),
	className: PropTypes.string,
};

MenuLeftDivider.defaultProps = {
	className: "",
};

const MenuRightDivider = (props) => (
	<div data-testid='menu-right-divider' className={`right-divider ${props.className}`}>{props.children}</div>
);

MenuRightDivider.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.shape({
			type: PropTypes.oneOf([ImageDescriptor]),
		}),
		PropTypes.node,
	]),
	className: PropTypes.string,
};

MenuRightDivider.defaultProps = {
	className: "",
};

MenuDivider.MenuLeftDivider = MenuLeftDivider;
MenuDivider.MenuRightDivider = MenuRightDivider;
