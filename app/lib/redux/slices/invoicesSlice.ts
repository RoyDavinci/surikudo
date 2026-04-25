/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const baseUrl = "https://dev.studiosurikudo.com";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Invoice {
	id: string;
	date: string;
	desc: string;
	amount: string;
	status: string;
}

interface InvoicesState {
	list: Invoice[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchInvoices = createAsyncThunk<
	Invoice[],
	void,
	{ rejectValue: string }
>("invoices/fetchInvoices", async (_, { rejectWithValue, getState }) => {
	try {
		const { auth } = getState() as { auth: { user: { token: string } | null } };
		const token = auth.user?.token;

		const res = await fetch(
			`${baseUrl}/api/v2/method/studio_app.api.invoices.get_invoices`,
			{
				headers: {
					Authorization: `token ${token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return rejectWithValue(err.message ?? "Failed to fetch invoices");
		}

		const data = await res.json();
		console.log("data", data);
		// Adjust mapping once you inspect the real response shape
		return (data.data ?? []).map((inv: any) => ({
			id: inv.name, // "INV-2604-0002"
			date: inv.invoice_date, // "2026-04-25"  (was inv.posting_date — doesn't exist)
			desc: inv.booking ?? "-", // "BOOK-2604-0030" (no description field in response)
			amount: inv.total_amount, // 15000.0 as a number (format in the UI)
			status: inv.status ?? "Issued", // "Issued"
		}));
	} catch {
		return rejectWithValue("Network error — please try again");
	}
});

export const fetchInvoiceById = createAsyncThunk<
	Invoice,
	string,
	{ rejectValue: string }
>("invoices/fetchById", async (invoiceId, { rejectWithValue, getState }) => {
	try {
		const { auth } = getState() as { auth: { user: { token: string } | null } };
		const token = auth.user?.token;

		const res = await fetch(
			`${baseUrl}/api/v2/method/studio_app.api.invoices.get_invoice?invoice_id=${invoiceId}`,
			{
				headers: {
					Authorization: `token ${token}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return rejectWithValue(err.message ?? "Failed to fetch invoice");
		}

		const data = await res.json();

		return (data.data ?? []).map((inv: any) => ({
			id: inv.name, // "INV-2604-0002"
			date: inv.invoice_date, // "2026-04-25"  (was inv.posting_date — doesn't exist)
			desc: inv.booking ?? "-", // "BOOK-2604-0030" (no description field in response)
			amount: inv.total_amount, // 15000.0 as a number (format in the UI)
			status: inv.status ?? "Issued", // "Issued"
		}));
	} catch {
		return rejectWithValue("Network error — please try again");
	}
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState: InvoicesState = {
	list: [],
	status: "idle",
	error: null,
};

const invoicesSlice = createSlice({
	name: "invoices",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchInvoices.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(
				fetchInvoices.fulfilled,
				(state, action: PayloadAction<Invoice[]>) => {
					state.status = "succeeded";
					state.list = action.payload;
				},
			)
			.addCase(fetchInvoices.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "Unknown error";
			})

			.addCase(fetchInvoiceById.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(
				fetchInvoiceById.fulfilled,
				(state, action: PayloadAction<Invoice>) => {
					state.status = "succeeded";
					// Merge into list, replacing if already exists
					const idx = state.list.findIndex((i) => i.id === action.payload.id);
					if (idx !== -1) state.list[idx] = action.payload;
					else state.list.push(action.payload);
				},
			)
			.addCase(fetchInvoiceById.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload ?? "Unknown error";
			});
	},
});

export default invoicesSlice.reducer;
