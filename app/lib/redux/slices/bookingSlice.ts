/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const baseUrl = "https://dev.studiosurikudo.com";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Booking {
	date: string;
	studio: string;
	bundle: string;
	duration: string;
	addons: string;
	total: string;
	status: "UPCOMING" | "COMPLETE";
}

interface BookingsState {
	upcoming: Booking[];
	previous: Booking[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchUpcomingBookings = createAsyncThunk<
	Booking[],
	void,
	{ rejectValue: string }
>("bookings/fetchUpcoming", async (_, { rejectWithValue, getState }) => {
	try {
		const { auth } = getState() as { auth: { user: { token: string } | null } };
		const token = auth.user?.token;

		const res = await fetch(
			`${baseUrl}/api/method/studio_app.api.bookings.get_upcoming_bookings`,
			{
				headers: {
					Authorization: `Token ${token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return rejectWithValue(
				err.message ?? "Failed to fetch upcoming bookings",
			);
		}

		const data = await res.json();
		// Adjust the mapping below once you see the real response shape
		return (data.message ?? []).map((b: any) => ({
			...b,
			status: "UPCOMING" as const,
		}));
	} catch {
		return rejectWithValue("Network error — please try again");
	}
});

export const fetchPreviousBookings = createAsyncThunk<
	Booking[],
	void,
	{ rejectValue: string }
>("bookings/fetchPrevious", async (_, { rejectWithValue, getState }) => {
	try {
		const { auth } = getState() as { auth: { user: { token: string } | null } };
		const token = auth.user?.token;

		const res = await fetch(
			`${baseUrl}/api/v2/method/studio_app.api.bookings.get_previous_bookings`,
			{
				headers: {
					Authorization: `Token ${token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return rejectWithValue(
				err.message ?? "Failed to fetch previous bookings",
			);
		}

		const data = await res.json();
		console.log("bookings", data);
		return (data.message ?? []).map((b: any) => ({
			...b,
			status: "COMPLETE" as const,
		}));
	} catch {
		return rejectWithValue("Network error — please try again");
	}
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState: BookingsState = {
	upcoming: [],
	previous: [],
	status: "idle",
	error: null,
};

const bookingsSlice = createSlice({
	name: "bookings",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		const setLoading = (state: BookingsState) => {
			state.status = "loading";
			state.error = null;
		};
		const setFailed = (
			state: BookingsState,
			action: PayloadAction<string | undefined>,
		) => {
			state.status = "failed";
			state.error = action.payload ?? "Unknown error";
		};

		builder
			.addCase(fetchUpcomingBookings.pending, setLoading)
			.addCase(fetchUpcomingBookings.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.upcoming = action.payload;
			})
			.addCase(fetchUpcomingBookings.rejected, setFailed)

			.addCase(fetchPreviousBookings.pending, setLoading)
			.addCase(fetchPreviousBookings.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.previous = action.payload;
			})
			.addCase(fetchPreviousBookings.rejected, setFailed);
	},
});

export default bookingsSlice.reducer;
