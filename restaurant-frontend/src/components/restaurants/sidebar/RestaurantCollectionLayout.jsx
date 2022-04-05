import React, { useState, useEffect } from "react";
import { AddCollectionModal } from "../../collections/AddCollection";
import { Aside } from "./Aside";
import { getAllCollections } from "../../../apis/CollectionApi";
import { store } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { RestaurantCollection } from "../../collections/RestaurantCollection";

export const RestaurantCollectionLayout = () => {
	const navigate = useNavigate();

	const [open, setOpen] = useState(false);
	const [collections, setCollections] = useState([]);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [restaurantCollections, setRestaurantCollections] = useState({});

	const getRestaurantCollections = () => {
		const { authToken } = store.getState();
		getAllCollections(authToken)
			.then((collectionData) => {
				if (collectionData && collectionData.results)
					setCollections(collectionData.results);
			})
			.catch((err) => {
				console.log(Object.keys(err));
			});
	};

	const handleCollectionClick = (collectionId) => {
		const collection = collections.find((c) => c.id === collectionId);
		const restaurants = collection.restaurants;
		setRestaurantCollections({
			results: restaurants,
			total_objects: restaurants.length,
		});
	};

	const navigateToHomepage = () => {
		navigate("/restaurant");
	};

	useEffect(() => {
		getRestaurantCollections();
	}, []);

	return (
		<div className="app">
			<Aside
				handleModalOpen={handleOpen}
				collections={collections}
				handleCollectionClick={handleCollectionClick}
				navigateToHomepage={navigateToHomepage}
			/>
			<RestaurantCollection
				currentPage={restaurantCollections}
				loading={loading}
			></RestaurantCollection>
		
			<AddCollectionModal
				open={open}
				handleClose={handleClose}
				getRestaurantCollections={getRestaurantCollections}
			></AddCollectionModal>
		</div>
	);
};

export default Layout;
