import PropTypes from "prop-types";
import React from "react";
import {
	ProSidebar,
	Menu,
	MenuItem,
	SubMenu,
	SidebarHeader,
	SidebarFooter,
	SidebarContent,
} from "react-pro-sidebar";
import { FaTachometerAlt, FaRegLaughWink } from "react-icons/fa";
import {GrAdd} from "react-icons/gr";

export const Aside = ({handleModalOpen, collections, handleCollectionClick, navigateToHomepage, displayName, signOutUser }) => {
	return (
		<ProSidebar
			image={false}
			breakPoint="md"
		>
			<SidebarHeader>
				<div
					style={{
						padding: "24px",
						textTransform: "uppercase",
						fontWeight: "bold",
						fontSize: 14,
						letterSpacing: "1px",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					Hi {displayName ? displayName : "Guest"}
				</div>
			</SidebarHeader>

			<SidebarContent>
				<Menu iconShape="circle">
					<MenuItem onClick={navigateToHomepage}
						icon={<FaTachometerAlt />}
					>
						HomePage
					</MenuItem>
				</Menu>
				<Menu iconShape="circle">
					<SubMenu
						suffix={<span className="badge yellow">{collections ? collections.results ? collections.results.length : 0 : 0}</span>}
						title="My Collections"
						icon={<FaRegLaughWink />}
					>
						{collections && collections.results && collections.results.map((c) => {
							return(
								<MenuItem key={c.id} onClick={() => handleCollectionClick(c.id)}>{c.title}</MenuItem>
							);
						})}
					</SubMenu>
				</Menu>
				<Menu iconShape="circle">
					<MenuItem onClick={handleModalOpen}
						icon={<GrAdd />}
					>
						Add New Collection
					</MenuItem>
				</Menu>
			</SidebarContent>

			<SidebarFooter style={{ textAlign: "center" }}>
				<div
					className="sidebar-btn-wrapper"
					style={{
						padding: "20px 24px",
					}}
				>
					<a
						onClick={signOutUser}
						target="_blank"
						className="sidebar-btn"
						rel="noopener noreferrer"
					>
						<span style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
							Sign Out
						</span>
					</a>
				</div>
			</SidebarFooter>
		</ProSidebar>
	);
};

Aside.propTypes = {
	handleModalOpen: PropTypes.func.isRequired,
	signOutUser: PropTypes.func.isRequired,
	collections: PropTypes.array.isRequired,
	handleCollectionClick: PropTypes.func.isRequired,
	navigateToHomepage: PropTypes.func.isRequired,
	displayName: PropTypes.string.isRequired,
};
