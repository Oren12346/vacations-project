// Redux slice that stores the authenticated user state.
import UserModel from "../1-models/user-model";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UserState = UserModel | null;

const initialState: UserState = null as UserState;

// Store the logged-in user in Redux.
const userSlice = createSlice({

    name: "user",
    initialState,
    reducers: {

                // Save the current user in the Redux store.
        initUser: (_currentState, action: PayloadAction<UserModel>) => {

            return action.payload;

        },
                // Clear the user from the Redux store on logout.
        logoutUser: (_currentState) => {

            return null;

        }

    },


});


export const { initUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;