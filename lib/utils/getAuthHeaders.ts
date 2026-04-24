import { AuthUser } from "../redux/slices/authSlice";

// Helper to get auth headers anywhere in your app
export const getAuthHeaders = () => {
	const raw = localStorage.getItem("auth_user");
	if (!raw) return {};
	const user: AuthUser = JSON.parse(raw);
	return {
		Authorization: `Token ${user.token}`,
		"Content-Type": "application/json",
	};
};
