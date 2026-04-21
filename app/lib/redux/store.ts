import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookingsReducer from "./slices/bookingSlice";
import invoicesReducer from "./slices/invoicesSlice";
import bookingFlowReducer from "./slices/bookingFlowSlice";
import studioReducer from "./slices/studioSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		bookings: bookingsReducer,
		invoices: invoicesReducer,
		bookingFlow: bookingFlowReducer,
		studio: studioReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
