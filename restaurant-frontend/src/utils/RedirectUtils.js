import { useNavigate } from "react-router";

export const redirectToHomePage = () => {
	const navigate = useNavigate();
	navigate("/restaurant");
};
