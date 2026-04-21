/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { PackageServiceItem } from "./studioSlice";

const baseUrl = "http://164.92.130.188";
const baseUrl2 = "http://164.92.130.188";

const authHeaders = (token: string) => ({
	Authorization: `Token ${token}`,
	"Content-Type": "application/json",
});
const authHeaders2 = (token: string) => ({
	Authorization: `Token ${token}`,
	"Content-Type": "application/json",
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectedPackage {
	id: string;
	name: string;
	price: number;
	unit: string;
	type: "package" | "bundle" | "hourly" | "service";
	serviceId: string; // SERV-xxxx
	studioRoomId: string; // ROOM-xxxx
	studioName: string;
	durationHours: number;
	packageServices?: PackageServiceItem[];
}

export interface TimeSlot {
	start_time: string; // "09:00:00"
	end_time: string;
	available: boolean;
	label: string; // "9:00 AM"
}

export interface Addon {
	id: string; // ADD-xxxx
	name: string;
	description: string;
	price: number;
	unit: string;
}

export interface BookingFlowState {
	// Step 1 — selection
	selection: SelectedPackage | null;

	// Step 2 — date/time
	selectedDate: string | null; // "2026-04-18"
	selectedSlot: TimeSlot | null;
	slots: TimeSlot[];
	slotsStatus: "idle" | "loading" | "succeeded" | "failed";
	slotsError: string | null;

	// Step 3 — addons + payment
	selectedAddonIds: string[];
	addons: Addon[];
	addonsStatus: "idle" | "loading" | "succeeded" | "failed";
	addonsError: string | null;
	promoCode: string;
	promoDiscount: number;
	specialNote: string;

	// Draft booking
	draftBookingId: string | null;
	createStatus: "idle" | "loading" | "succeeded" | "failed";
	createError: string | null;

	// Submit (post-payment)
	submitStatus: "idle" | "loading" | "succeeded" | "failed";
	submitError: string | null;
	paystackUrl: string | null;
	paymentRef: string | null;
	initPayStatus: "idle" | "loading" | "succeeded" | "failed";
	initPayError: string | null;
	verifyStatus: "idle" | "loading" | "succeeded" | "failed";
	verifyError: string | null;
	verifiedBooking: {
		booking_id: string;
		studio_name: string;
		service_name: string;
		start_datetime: string;
		duration: number;
		addons: string[];
		promo_code?: string;
	} | null;
}

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchAvailableSlots = createAsyncThunk<
	TimeSlot[],
	{ studioRoomId: string; date: string },
	{ rejectValue: string }
>(
	"bookingFlow/fetchSlots",
	async ({ studioRoomId, date }, { rejectWithValue, getState }) => {
		try {
			const { auth } = getState() as {
				auth: { user: { token: string } | null };
			};
			const token = auth.user?.token ?? "";
			console.log("params", studioRoomId, date);

			const res = await fetch(
				`${baseUrl}/api/v2/method/studio_app.api.availability.get_available_slots?studio_room=${studioRoomId}&date=${date}`,
				{ headers: authHeaders(token) },
			);

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				return rejectWithValue(err.message ?? "Failed to fetch slots");
			}

			const data = await res.json();
			console.log(data.data, "slots");
			// Adjust mapping once you see the real shape — data.message is assumed to be an array
			const raw: any[] = data.data ?? [];

			return raw.map((s: any) => {
				const start = s.start.split("T")[1]; // "09:00:00"
				const end = s.end.split("T")[1];

				return {
					start_time: start,
					end_time: end,
					available: s.is_available ?? true,
					label: formatTime(start),
				};
			});
		} catch {
			return rejectWithValue("Network error — please try again");
		}
	},
);

export const fetchAddons = createAsyncThunk<
	Addon[],
	void,
	{ rejectValue: string }
>("bookingFlow/fetchAddons", async (_, { rejectWithValue, getState }) => {
	try {
		const { auth } = getState() as {
			auth: { user: { token: string } | null };
		};
		const token = auth.user?.token ?? "";

		// ✅ Add query params like your curl
		const params = new URLSearchParams({
			fields: JSON.stringify([
				"name",
				"description",
				"duration",
				"rate_per_hour",
				"flat_rate",
				"is_active",
			]),
			start: "0",
			limit: "50",
		});

		const res = await fetch(
			`${baseUrl}/api/v2/document/Studio Addon?${params.toString()}`,
			{
				headers: authHeaders(token),
			},
		);
		console.log("res", res);

		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return rejectWithValue(err.message ?? "Failed to fetch add-ons");
		}

		const data = await res.json();
		console.log("thunk addons", data.data);

		// ❗ IMPORTANT: it's data.data NOT data.message
		const raw: any[] = data.data ?? [];

		return raw.map((a: any) => ({
			id: a.name,
			name: a.service_name ?? a.name,
			description: a.description ?? "",
			price: a.flat_rate ?? a.flat_rate ?? 0,
			unit: `${a.rate_per_hour ?? 1} hr`,
		}));
	} catch {
		return rejectWithValue("Network error — please try again");
	}
});

export const createDraftBooking = createAsyncThunk<
	string, // returns booking_id
	void,
	{ rejectValue: string }
>("bookingFlow/createDraft", async (_, { rejectWithValue, getState }) => {
	try {
		const state = getState() as {
			auth: { user: { token: string } | null };
			bookingFlow: BookingFlowState;
		};
		const token = state.auth.user?.token ?? "";
		const { selection, selectedDate, selectedSlot, selectedAddonIds, addons } =
			state.bookingFlow;

		if (!selection || !selectedDate || !selectedSlot) {
			return rejectWithValue("Missing booking details");
		}

		// Build start_datetime: "2026-04-18 09:00:00"
		const start_datetime = `${selectedDate} ${selectedSlot.start_time}`;

		const selectedAddons = addons
			.filter((a) => selectedAddonIds.includes(a.id))
			.map((a) => ({ addon: a.id, quantity: 1 }));

		const body = {
			service: selection.serviceId,
			studio_room: selection.studioRoomId,
			duration: selection.durationHours,
			start_datetime,
			addons: selectedAddons,
		};

		const res = await fetch(
			`${baseUrl}/api/v2/method/studio_app.api.bookings.create_booking`,
			{
				method: "POST",
				headers: authHeaders(token),
				body: JSON.stringify(body),
			},
		);

		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return rejectWithValue(err.message ?? "Failed to create booking");
		}

		const data = await res.json();
		console.log("draft", data);
		return data.data?.booking ?? data.message?.name ?? "";
	} catch {
		return rejectWithValue("Network error — please try again");
	}
});

export const verifyPayment = createAsyncThunk<
	{
		booking_id: string;
		studio_name: string;
		service_name: string;
		start_datetime: string;
		duration: number;
		addons: string[];
		promo_code?: string;
	},
	string,
	{ rejectValue: string }
>(
	"bookingFlow/verifyPayment",
	async (reference, { rejectWithValue, getState }) => {
		try {
			const { auth } = getState() as {
				auth: { user: { token: string } | null };
			};
			const token = auth.user?.token ?? "";

			const res = await fetch(
				`${baseUrl}/api/v2/method/studio_app.api.payments.verify_payment?reference=${reference}`,
				{ headers: authHeaders(token) },
			);
			console.log("reference", res);

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				return rejectWithValue(err.message ?? "Payment verification failed");
			}

			const data = await res.json();
			return data.message; // booking summary from Paystack/server
		} catch {
			return rejectWithValue("Network error — please try again");
		}
	},
);

export const submitBooking = createAsyncThunk<
	void,
	{ bookingId: string; paymentRef: string },
	{ rejectValue: string }
>(
	"bookingFlow/submit",
	async ({ bookingId, paymentRef }, { rejectWithValue, getState }) => {
		try {
			const { auth } = getState() as {
				auth: { user: { token: string } | null };
			};
			const token = auth.user?.token ?? "";

			const res = await fetch(
				`${baseUrl}/api/v2/method/studio_app.api.bookings.submit_booking`,
				{
					method: "POST",
					headers: authHeaders(token),
					body: JSON.stringify({
						booking_id: bookingId,
						payment_reference: paymentRef,
					}),
				},
			);

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				return rejectWithValue(err.message ?? "Failed to submit booking");
			}
		} catch {
			return rejectWithValue("Network error — please try again");
		}
	},
);

export const initializePayment = createAsyncThunk<
	{ authorization_url: string; reference: string; access_code: string },
	string, // booking_id
	{ rejectValue: string }
>(
	"bookingFlow/initializePayment",
	async (bookingId, { rejectWithValue, getState }) => {
		try {
			const { auth } = getState() as {
				auth: { user: { token: string } | null };
			};
			const token = auth.user?.token ?? "";

			const res = await fetch(
				`${baseUrl}/api/v2/method/studio_app.api.payments.initialize_payment?booking_id=${bookingId}`,
				{ headers: authHeaders(token) },
			);
			console.log("initialize", res);

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				return rejectWithValue(err.message ?? "Failed to initialize payment");
			}

			const data = await res.json();
			return data.data; // { authorization_url, reference, access_code }
		} catch {
			return rejectWithValue("Network error — please try again");
		}
	},
);

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatTime(time24: string): string {
	const [hStr, mStr] = time24.split(":");
	let h = parseInt(hStr);
	const m = mStr ?? "00";
	const meridiem = h >= 12 ? "PM" : "AM";
	if (h === 0) h = 12;
	else if (h > 12) h -= 12;
	return `${h}:${m} ${meridiem}`;
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState: BookingFlowState = {
	selection: null,
	selectedDate: null,
	selectedSlot: null,
	slots: [],
	slotsStatus: "idle",
	slotsError: null,
	selectedAddonIds: [],
	addons: [],
	addonsStatus: "idle",
	addonsError: null,
	promoCode: "",
	promoDiscount: 0,
	specialNote: "",
	draftBookingId: null,
	createStatus: "idle",
	createError: null,
	submitStatus: "idle",
	submitError: null,
	paystackUrl: null,
	paymentRef: null,
	initPayStatus: "idle",
	initPayError: null,
	verifyStatus: "idle",
	verifyError: null,
	verifiedBooking: null,
};

const bookingFlowSlice = createSlice({
	name: "bookingFlow",
	initialState,
	reducers: {
		setSelection(state, action: PayloadAction<SelectedPackage>) {
			state.selection = action.payload;
			// Reset downstream state when selection changes
			state.selectedDate = null;
			state.selectedSlot = null;
			state.slots = [];
			state.slotsStatus = "idle";
			state.selectedAddonIds = [];
			state.draftBookingId = null;
			state.createStatus = "idle";
			state.submitStatus = "idle";
		},
		setDate(state, action: PayloadAction<string>) {
			state.selectedDate = action.payload;
			state.selectedSlot = null; // clear slot when date changes
		},
		setSlot(state, action: PayloadAction<TimeSlot>) {
			state.selectedSlot = action.payload;
		},
		toggleAddon(state, action: PayloadAction<string>) {
			const id = action.payload;
			const idx = state.selectedAddonIds.indexOf(id);
			if (idx === -1) state.selectedAddonIds.push(id);
			else state.selectedAddonIds.splice(idx, 1);
		},
		setPromo(state, action: PayloadAction<{ code: string; discount: number }>) {
			state.promoCode = action.payload.code;
			state.promoDiscount = action.payload.discount;
		},
		clearPromo(state) {
			state.promoCode = "";
			state.promoDiscount = 0;
		},
		setSpecialNote(state, action: PayloadAction<string>) {
			state.specialNote = action.payload;
		},
		resetFlow(state) {
			return initialState;
		},
	},
	extraReducers: (builder) => {
		builder
			// slots
			.addCase(fetchAvailableSlots.pending, (state) => {
				state.slotsStatus = "loading";
				state.slotsError = null;
				state.slots = [];
				state.selectedSlot = null;
			})
			.addCase(fetchAvailableSlots.fulfilled, (state, action) => {
				state.slotsStatus = "succeeded";
				state.slots = action.payload;
			})
			.addCase(fetchAvailableSlots.rejected, (state, action) => {
				state.slotsStatus = "failed";
				state.slotsError = action.payload ?? "Unknown error";
			})

			// addons
			.addCase(fetchAddons.pending, (state) => {
				state.addonsStatus = "loading";
				state.addonsError = null;
			})
			.addCase(fetchAddons.fulfilled, (state, action) => {
				state.addonsStatus = "succeeded";
				state.addons = action.payload;
			})
			.addCase(fetchAddons.rejected, (state, action) => {
				state.addonsStatus = "failed";
				state.addonsError = action.payload ?? "Unknown error";
			})

			// create draft
			.addCase(createDraftBooking.pending, (state) => {
				state.createStatus = "loading";
				state.createError = null;
			})
			.addCase(createDraftBooking.fulfilled, (state, action) => {
				state.createStatus = "succeeded";
				state.draftBookingId = action.payload;
			})
			.addCase(createDraftBooking.rejected, (state, action) => {
				state.createStatus = "failed";
				state.createError = action.payload ?? "Unknown error";
			})

			// submit
			.addCase(submitBooking.pending, (state) => {
				state.submitStatus = "loading";
				state.submitError = null;
			})
			.addCase(submitBooking.fulfilled, (state) => {
				state.submitStatus = "succeeded";
			})
			.addCase(submitBooking.rejected, (state, action) => {
				state.submitStatus = "failed";
				state.submitError = action.payload ?? "Unknown error";
			}) // initialize payment
			.addCase(initializePayment.pending, (state) => {
				state.initPayStatus = "loading";
				state.initPayError = null;
			})
			.addCase(initializePayment.fulfilled, (state, action) => {
				state.initPayStatus = "succeeded";
				state.paystackUrl = action.payload.authorization_url;
				state.paymentRef = action.payload.reference;
			})
			.addCase(initializePayment.rejected, (state, action) => {
				state.initPayStatus = "failed";
				state.initPayError = action.payload ?? "Unknown error";
			})

			// verify payment
			.addCase(verifyPayment.pending, (state) => {
				state.verifyStatus = "loading";
				state.verifyError = null;
			})
			.addCase(verifyPayment.rejected, (state, action) => {
				state.verifyStatus = "failed";
				state.verifyError = action.payload ?? "Unknown error";
			})
			.addCase(verifyPayment.fulfilled, (state, action) => {
				state.verifyStatus = "succeeded";
				state.verifiedBooking = action.payload;
			});
	},
});

export const {
	setSelection,
	setDate,
	setSlot,
	toggleAddon,
	setPromo,
	clearPromo,
	setSpecialNote,
	resetFlow,
} = bookingFlowSlice.actions;

export default bookingFlowSlice.reducer;
