import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const baseUrl = "http://164.92.130.188";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Customer {
	name: string;
	email: string;
	first_name: string;
	last_name: string;
	full_name: string;
	phone_number: string | null;
}

export interface AuthUser {
	full_name: string;
	email: string;
	api_key: string;
	api_secret: string;
	token: string;
	customer: Customer;
}

export interface AuthState {
	user: AuthUser | null;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

interface LoginCredentials {
	email: string;
	password: string;
}

interface LoginApiResponse {
	full_name: string;
	home_page: string;
	message: {
		api_key: string;
		api_secret: string;
		customer: Customer;
	};
}

// ─── Thunk ────────────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk<
	AuthUser,
	LoginCredentials,
	{ rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
	try {
		const res = await fetch(`${baseUrl}/api/method/studio_app.api.auth.login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(credentials),
		});

		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			const serverMsg = err._server_messages
				? JSON.parse(err._server_messages)[0]?.message
				: null;
			return rejectWithValue(serverMsg ?? err.message ?? "Login failed");
		}

		const data: LoginApiResponse = await res.json();

		const token = `${data.message.api_key}:${data.message.api_secret}`;

		return {
			full_name: data.full_name,
			email: data.message.customer.email,
			api_key: data.message.api_key,
			api_secret: data.message.api_secret,
			token,
			customer: data.message.customer,
		};
	} catch {
		return rejectWithValue("Network error — please try again");
	}
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const loadUser = (): AuthUser | null => {
	try {
		const raw = localStorage.getItem("auth_user");
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
};
const initialState: AuthState = {
	user: loadUser(), // ← rehydrate on app boot
	status: "idle",
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout(state) {
			state.user = null;
			state.status = "idle";
			state.error = null;
			localStorage.removeItem("auth_user");
		},
		clearError(state) {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "Unknown error";
			})
			.addCase(
				loginUser.fulfilled,
				(state, action: PayloadAction<AuthUser>) => {
					state.status = "succeeded";
					state.user = action.payload;
					// Persist to localStorage
					localStorage.setItem("auth_user", JSON.stringify(action.payload));
				},
			);
	},
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
