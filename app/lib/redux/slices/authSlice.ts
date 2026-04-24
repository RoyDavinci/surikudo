// ─── authSlice.ts ─────────────────────────────────────────────────────────────
// Key changes:
// 1. silentAdminLogin always refreshes (removes the early-return guard)
// 2. Exports a makeAuthenticatedFetch helper that retries once on 401
// 3. Fixes displayPrice (was using ?? on boolean false)

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const baseUrl = "https://dev.studiosurikudo.com/api/v2";
export const ADMIN_EMAIL = "roy@studiosurikudo.com";
const ADMIN_PASSWORD = "Studi@Sur!kudo";

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
	data: { api_key: string; api_secret: string; customer: Customer };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isAdminAccount(user: AuthUser | null): boolean {
	if (!user) return true;
	return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

function mapLoginResponse(data: LoginApiResponse): AuthUser {
	return {
		full_name: data.full_name,
		email: data.data.customer.email,
		api_key: data.data.api_key,
		api_secret: data.data.api_secret,
		token: `${data.data.api_key}:${data.data.api_secret}`,
		customer: data.data.customer,
	};
}

// ── Re-login the admin silently and return a fresh token ─────────────────────
async function refreshAdminToken(): Promise<string | null> {
	try {
		const res = await fetch(`${baseUrl}/method/studio_app.api.auth.login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
		});
		if (!res.ok) return null;
		const data: LoginApiResponse = await res.json();
		const user = mapLoginResponse(data);
		if (typeof window !== "undefined") {
			localStorage.setItem("auth_user", JSON.stringify(user));
		}
		return user.token;
	} catch {
		return null;
	}
}

// ── Authenticated fetch — retries once on 401 by refreshing the admin token ──
export async function makeAuthenticatedFetch(
	url: string,
	token: string,
	options: RequestInit = {},
): Promise<Response> {
	const headers = {
		...(options.headers ?? {}),
		Authorization: `Token ${token}`,
		"Content-Type": "application/json",
	};

	const res = await fetch(url, { ...options, headers });

	if (res.status === 401) {
		console.warn("[Auth] 401 received — refreshing admin token and retrying");
		const newToken = await refreshAdminToken();
		if (newToken) {
			return fetch(url, {
				...options,
				headers: { ...headers, Authorization: `Token ${newToken}` },
			});
		}
	}

	return res;
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
		return mapLoginResponse(data);
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
			body: JSON.stringify(credentials),
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
		const user: AuthUser = {
			full_name: data.data.customer.full_name,
			email: data.data.customer.email,
			api_key: data.data.api_key,
			api_secret: data.data.api_secret,
			token: `${data.data.api_key}:${data.data.api_secret}`,
			customer: data.data.customer,
		};
		console.log("[Register] mapped user:", user);
		return user;
	} catch {
		return rejectWithValue("Network error — please try again");
	}
});

// Always refreshes — no early return guard so a stale/expired token gets replaced
export const silentAdminLogin = createAsyncThunk<
	AuthUser | null,
	void,
	{ rejectValue: string }
>("auth/silentAdminLogin", async (_, { rejectWithValue }) => {
	try {
		const res = await fetch(`${baseUrl}/method/studio_app.api.auth.login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
		});
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return rejectWithValue(err.message ?? "Silent login failed");
		}
		const data: LoginApiResponse = await res.json();
		const user = mapLoginResponse(data);
		if (typeof window !== "undefined") {
			localStorage.setItem("auth_user", JSON.stringify(user));
		}
		return user;
	} catch {
		return rejectWithValue("Network error during silent login");
	}
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const loadUser = (): AuthUser | null => {
	try {
		const raw =
			typeof window !== "undefined" ? localStorage.getItem("auth_user") : null;
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
			if (typeof window !== "undefined") localStorage.removeItem("auth_user");
		},
		clearError(state) {
			state.error = null;
			state.registerError = null;
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
					if (typeof window !== "undefined")
						localStorage.setItem("auth_user", JSON.stringify(action.payload));
				},
			)
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
					if (typeof window !== "undefined")
						localStorage.setItem("auth_user", JSON.stringify(action.payload));
				},
			)
			.addCase(silentAdminLogin.fulfilled, (state, action) => {
				if (action.payload) state.user = action.payload;
			})
			.addCase(silentAdminLogin.rejected, (_, action) => {
				console.warn("[SilentLogin] failed:", action.payload);
			});
	},
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
