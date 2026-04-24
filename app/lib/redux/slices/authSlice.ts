import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const baseUrl = "https://dev.studiosurikudo.com/api/v2";

const ADMIN_EMAIL = "roy@studiosurikudo.com";

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
	registerStatus: "idle" | "loading" | "succeeded" | "failed";
	registerError: string | null;
}

interface LoginCredentials {
	email: string;
	password: string;
}

interface RegisterCredentials {
	email: string;
	password: string;
	full_name: string;
}

interface LoginApiResponse {
	full_name: string;
	home_page: string;
	message: string;
	data: {
		api_key: string;
		api_secret: string;
		customer: Customer;
	};
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isAdminAccount(user: AuthUser | null): boolean {
	if (!user) return true; // no user at all → treat as admin (force login)
	return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk<
	AuthUser,
	LoginCredentials,
	{ rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
	try {
		const res = await fetch(`${baseUrl}/method/studio_app.api.auth.login`, {
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
		const token = `${data.data.api_key}:${data.data.api_secret}`;

		return {
			full_name: data.full_name,
			email: data.data.customer.email,
			api_key: data.data.api_key,
			api_secret: data.data.api_secret,
			token,
			customer: data.data.customer,
		};
	} catch {
		return rejectWithValue("Network error — please try again");
	}
});

export const registerUser = createAsyncThunk<
	AuthUser,
	RegisterCredentials,
	{ rejectValue: string }
>("auth/registerUser", async (credentials, { rejectWithValue }) => {
	try {
		const res = await fetch(`${baseUrl}/method/studio_app.api.auth.register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: credentials.email,
				password: credentials.password,
				full_name: credentials.full_name,
			}),
		});

		const data = await res.json();
		console.log("[Register] raw response:", data);

		if (!res.ok) {
			const serverMsg = data._server_messages
				? JSON.parse(data._server_messages)[0]?.message
				: null;

			return rejectWithValue(
				serverMsg ?? data.message ?? "Registration failed",
			);
		}

		// ✅ CORRECT STRUCTURE (data.data)
		const token = `${data.data.api_key}:${data.data.api_secret}`;

		const user: AuthUser = {
			full_name: data.data.customer.full_name,
			email: data.data.customer.email,
			api_key: data.data.api_key,
			api_secret: data.data.api_secret,
			token,
			customer: data.data.customer,
		};

		console.log("[Register] mapped user:", user);

		return user;
	} catch {
		return rejectWithValue("Network error — please try again");
	}
});

export const silentAdminLogin = createAsyncThunk<
	AuthUser,
	void,
	{ rejectValue: string; state: { auth: AuthState } }
>("auth/silentAdminLogin", async (_, { rejectWithValue, getState }) => {
	// Already have a user (admin or real customer) — skip
	if (getState().auth.user) return {} as AuthUser; // won't be used

	try {
		const res = await fetch(`${baseUrl}/method/studio_app.api.auth.login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: "roy@studiosurikudo.com",
				password: "Studi@Sur!kudo",
			}),
		});

		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return rejectWithValue(err.message ?? "Silent login failed");
		}

		const data: LoginApiResponse = await res.json();
		const token = `${data.data.api_key}:${data.data.api_secret}`;

		const user: AuthUser = {
			full_name: data.full_name,
			email: data.data.customer.email,
			api_key: data.data.api_key,
			api_secret: data.data.api_secret,
			token,
			customer: data.data.customer,
		};

		// Store so subsequent refreshes skip the call
		localStorage.setItem("auth_user", JSON.stringify(user));
		return user;
	} catch {
		return rejectWithValue("Network error during silent login");
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
	user: loadUser(),
	status: "idle",
	error: null,
	registerStatus: "idle",
	registerError: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout(state) {
			state.user = null;
			state.status = "idle";
			state.error = null;
			state.registerStatus = "idle";
			state.registerError = null;
			localStorage.removeItem("auth_user");
		},
		clearError(state) {
			state.error = null;
			state.registerError = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// ── Login ────────────────────────────────────────────────────────────
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
					localStorage.setItem("auth_user", JSON.stringify(action.payload));
				},
			)

			// ── Register ─────────────────────────────────────────────────────────
			.addCase(registerUser.pending, (state) => {
				state.registerStatus = "loading";
				state.registerError = null;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.registerStatus = "failed";
				state.registerError = action.payload ?? "Unknown error";
			})
			.addCase(
				registerUser.fulfilled,
				(state, action: PayloadAction<AuthUser>) => {
					state.registerStatus = "succeeded";
					state.user = action.payload;
					localStorage.setItem("auth_user", JSON.stringify(action.payload));
				},
			)
			.addCase(silentAdminLogin.fulfilled, (state, action) => {
				// getState check above returns {} if user already existed — ignore it
				if (action.payload?.token) {
					state.user = action.payload;
				}
			})
			.addCase(silentAdminLogin.rejected, (state, action) => {
				console.warn("[SilentLogin] failed:", action.payload);
			});
	},
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
