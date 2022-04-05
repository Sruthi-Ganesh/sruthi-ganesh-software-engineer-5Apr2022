import PropTypes from "prop-types";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { setNewCollection } from "../../apis/CollectionApi";
import { store } from "../../redux/store";
import { SectionDivider } from "../shared/SectionDivider";

import "./AddCollection.css";

export const AddCollectionModal = ({ open, handleClose, getRestaurantCollections}) => {
	const [title, setTitle] = useState(null);
	const [error, setError] = useState("");

	const handleTitleChange = (
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		const titleValue = event.target.value;
		setTitle(titleValue);
	};

	const saveCollection = (): void => {
		if (!title) {
			setError("Please enter title");
		}
		const { authToken } = store.getState();
		setNewCollection(title, authToken).finally(() => {
			getRestaurantCollections();
			handleClose();
		}).catch((err) => {
			console.log(Object.keys(err));
		}
		);
	};

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className='add-collection-modal'>
					<Typography className="modal-modal-error" variant="h6" component="h2">
						{error}
					</Typography>
					<Typography className="modal-modal-title" variant="h3" component="h3">
                        Add a collection
					</Typography>
					<SectionDivider/>
					<div className='modal-body'>
						<TextField
							required
							id="outlined-collection-title"
							label="Collection title"
							onChange={handleTitleChange}
						/>
					</div>
					<SectionDivider/>
					<div className='modal-actions'>
						<Button onClick={saveCollection}>Add</Button>
						<Button onClick={handleClose}>Cancel</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};
AddCollectionModal.propTypes = {
	open: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	getRestaurantCollections: PropTypes.func.isRequired,
};
