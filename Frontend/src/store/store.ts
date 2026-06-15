// Redux store configuration for the frontend application.
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import vacationsReducer from "./vacationsSlice";

// Create the Redux store and register all global state slices.
const store = configureStore({
    reducer: {
        user: userReducer,
        vacations: vacationsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
