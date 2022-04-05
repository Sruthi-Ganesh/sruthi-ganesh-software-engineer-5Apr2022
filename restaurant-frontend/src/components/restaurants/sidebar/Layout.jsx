import React, { useState, useEffect } from "react";
import { AddCollectionModal } from "../../collections/AddCollection";
import { Restaurant } from "../Main/Restaurant";
import { Aside } from "./Aside";
import { store } from "../../../redux/store";
import { getPageByNo } from "../../../utils/RestaurantUtils";
import { useNavigate } from "react-router-dom";
import { RestaurantCollection } from "../../collections/RestaurantCollection";
import { saveCollection } from "../../../apis/CollectionApi";
import { CollectionsModal } from "../../collections/CollectionsModal";
import { saveRestaurantCollections } from "../../../apis/RestaurantApi";
import { AddRestaurantsModal } from "../../restaurants/modals/AddRestaurantsModal";
import {signOut} from "../../../apis/authenticationApi";

function Layout() {
	const navigate = useNavigate();

	const goToSignInPage = () => {
		navigate("/");
	};

	const {
		pages,
		isLoading,
		currentPageNo,
		filter,
		collections,
		authToken,
		loadingCollections,
		mainPageUrl,
		displayName,
	} = store.getState();
	const openOnly = filter.openOnly !== 2;
	const {filterValue, weekDay, time, sortByTitle} = filter;
	const page = getPageByNo(pages, currentPageNo, filterValue, openOnly, weekDay, time, sortByTitle);

	const [openAddCollectionModal, setOpenAddCollectionModal] = useState(false);
	const handleAddCollectionModalOpen = () => setOpenAddCollectionModal(true);
	const handleAddCollectionModalClose = () => setOpenAddCollectionModal(false);
	const [openCollectionsModal, setOpenCollectionsModal] = useState(false);
	const [_, setType] = useState(0);
	const handleCollectionsModalOpen = () => setOpenCollectionsModal(true);
	const handleCollectionsModalClose = () => setOpenCollectionsModal(false);
	const [openAddRestaurantsModal, setOpenAddRestaurantsModal] = useState(false);
	const handleAddRestaurantsModalOpen = () => setOpenAddRestaurantsModal(true);
	const handleAddRestaurantsModalClose = () =>
		setOpenAddRestaurantsModal(false);
	const [currentPage, setCurrentPage] = useState(page);
	// const [restaurantCollections, setRestaurantCollections] = useState({});
	// const [collectionsState, setCollectionsState] = useState(collections);
	const [loading, setLoading] = useState(isLoading);
	const [collectionsLoading, setCollectionsLoading] = useState(loadingCollections);
	const [restaurantId, setRestaurantId] = useState(null);

	const signOutUser = () => {
		signOut(authToken).finally(() => navigate("/"));
	};

	const getRestaurantCollections = () => {
		store.dispatch({ type: "collectionsRequested", token: authToken });
	};

	const handleCollectionClick = (collectionId) => {
		store.dispatch({
			type: "mainPageUrl",
			payload: `collection/${collectionId}`,
		});
		setType(1 + `collection/${collectionId}`);
	};

	const loadCollections = (collectionId) => {
		const collection = collections.results.find((c) => c.id === collectionId);
		const restaurants = collection.restaurants;
		return {
			results: restaurants,
			total_objects: restaurants.length,
			title: collection.title,
			id: collection.id,
		};
	};

	const addToCollection = (restaurantId) => {
		handleCollectionsModalOpen();
		setRestaurantId(restaurantId);
	};

	const navigateToHomepage = () => {
		store.dispatch({ type: "mainPageUrl", payload: "restaurant" });
		setType(0);
	};

	const handleSaveCollection = (collections) => {
		saveRestaurantCollections(restaurantId, collections, authToken).then(() => {
			getRestaurantCollections();
			handleCollectionsModalClose();
		});
	};

	const handleSaveRestaurants = (restaurants) => {
		saveCollection(restaurantCollections.id, restaurants, authToken).then(
			() => {
				getRestaurantCollections();
				handleAddRestaurantsModalClose();
			}
		);
	};

	useEffect(() => {
		store.dispatch({
			type: "currentPageNo",
			authenticationFailureCallback: goToSignInPage,
			pageNum: 1,
		});
		getRestaurantCollections();
	}, []);

	store.subscribe(() => {
		const {
			pages,
			isLoading,
			currentPageNo,
			filter,
			loadingCollections

		} = store.getState();
		const openOnly = filter.openOnly !== 2;
		const {weekDay, time, sortByTitle, filterValue} = filter;
		const page = getPageByNo(pages, currentPageNo, filterValue, openOnly, weekDay, time, sortByTitle);
		setCurrentPage(page);
		setLoading(isLoading);
		setCollectionsLoading(loadingCollections);
	});

	let restaurantCollections;

	if (mainPageUrl.includes("collection/")) {
		const [_, collectionId] = mainPageUrl.split("/");
		restaurantCollections = loadCollections(parseInt(collectionId), collections);
	}

	const customFilter = weekDay && time;

	return (
		<div className="app">
			<Aside
				handleModalOpen={handleAddCollectionModalOpen}
				collections={collections}
				handleCollectionClick={handleCollectionClick}
				navigateToHomepage={navigateToHomepage}
				displayName={displayName}
				signOutUser={signOutUser}
			/>
			{restaurantCollections && restaurantCollections.results ? (
				<RestaurantCollection
					currentPage={restaurantCollections}
					loading={collectionsLoading}
					openOnly={openOnly}
					handleAddRestaurantsModalOpen={handleAddRestaurantsModalOpen}
					customFilter={customFilter}
				></RestaurantCollection>
			) : (
				<Restaurant
					currentPage={currentPage}
					loading={loading}
					openOnly={openOnly}
					addToCollection={addToCollection}
					customFilter={customFilter}
				></Restaurant>
			)}
			<AddCollectionModal
				open={openAddCollectionModal}
				handleClose={handleAddCollectionModalClose}
				getRestaurantCollections={getRestaurantCollections}
			></AddCollectionModal>
			<CollectionsModal
				open={openCollectionsModal}
				handleClose={handleCollectionsModalClose}
				restaurantCollections={collections}
				onSave={handleSaveCollection}
			></CollectionsModal>
			<AddRestaurantsModal
				open={openAddRestaurantsModal}
				onSave={handleSaveRestaurants}
				handleClose={handleAddRestaurantsModalClose}
			></AddRestaurantsModal>
		</div>
	);
}

export default Layout;
