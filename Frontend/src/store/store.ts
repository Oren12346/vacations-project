// Redux store configuration for the frontend application.
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

// Create the Redux store and register all reducers.
const store = configureStore({
    reducer: {
        user: userReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;