/* eslint-disable no-mixed-spaces-and-tabs */
import PropTypes from "prop-types";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { SectionDivider } from "../shared/SectionDivider";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

import "./AddCollection.css";

export const CollectionsModal = ({
	open,
	handleClose,
	restaurantCollections,
	onSave,
}) => {
	const [error, setError] = useState(null);
	const [collections, setCollections] = useState([]);

	const addToCollection = (event, collectionId): void => {
		console.log(event);
		const newCollection = [...collections];
		if (!newCollection.includes(collectionId)) {
			newCollection.push(collectionId);
		} else {
			newCollection.splice(newCollection.indexOf(collectionId), 1);
		}
		setCollections(newCollection);
	};

	const saveCollections = (): void => {
		if (collections.length === 0) {
			setError("Choose atleast one collection");
		}
		onSave(collections);
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
            Add to collection
					</Typography>
					<SectionDivider />
					<div className="modal-body">
						<FormGroup>
							{restaurantCollections &&
                restaurantCollections.results.map((collection) => {
                	return (
                		<FormControlLabel
                			key={collection.id}
                			control={
                				<Checkbox
                					onClick={(e) => addToCollection(e, collection.id)}
                				/>
                			}
                			label={collection.title}
                		/>
                	);
                })}
						</FormGroup>
					</div>
					<SectionDivider />
					<div className="modal-actions">
						<Button onClick={saveCollections}>Add</Button>
						<Button
							onClick={() => {
								setCollections([]);
								handleClose();
							}}
						>
              Cancel
						</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};
CollectionsModal.propTypes = {
	open: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	restaurantCollections: PropTypes.array.isRequired,
	onSave: PropTypes.func.isRequired,
};
