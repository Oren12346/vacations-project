// Redux slice that stores the vacations list shared across user and admin screens.
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacationModel } from "../1-models/vacation-model";

const initialState: VacationModel[] = [];

const vacationsSlice = createSlice({
    name: "vacations",
    initialState,
    reducers: {

        // Replace the current vacations list with data loaded from the server.
        initVacations: (_state, action: PayloadAction<VacationModel[]>) => {
            return action.payload;
        },

        // Add a newly created vacation to Redux with safe default like values.
        addVacation: (state, action: PayloadAction<VacationModel>) => {
            state.push({
                ...action.payload,
                likesCount: action.payload.likesCount ?? 0,
                isLiked: action.payload.isLiked ?? false
            });
        },

        // Merge updated vacation data while preserving existing like information.
        updateVacation: (state, action: PayloadAction<VacationModel>) => {
            const index = state.findIndex(v => v.vacationId === action.payload.vacationId);

            if (index >= 0) {
                state[index] = {
                    ...state[index],
                    ...action.payload
                };
            }
        },

        // Remove a deleted vacation from Redux.
        deleteVacation: (state, action: PayloadAction<number>) => {
            return state.filter(v => v.vacationId !== action.payload);
        },

        // Mark a vacation as liked and update its likes counter locally.
        likeVacation: (state, action: PayloadAction<number>) => {
            const vacation = state.find(v => v.vacationId === action.payload);

            if (vacation) {
                vacation.isLiked = true;
                vacation.likesCount = (vacation.likesCount ?? 0) + 1;
            }
        },

        // Mark a vacation as unliked and update its likes counter locally.
        unlikeVacation: (state, action: PayloadAction<number>) => {
            const vacation = state.find(v => v.vacationId === action.payload);

            if (vacation) {
                vacation.isLiked = false;
                vacation.likesCount = Math.max((vacation.likesCount ?? 0) - 1, 0);
            }
        },

        // Clear vacations when the logged-in user changes or logs out.
        clearVacations: () => {
            return [];
        }
    }
});

export const {
    initVacations,
    addVacation,
    updateVacation,
    deleteVacation,
    likeVacation,
    unlikeVacation,
    clearVacations
} = vacationsSlice.actions;

export default vacationsSlice.reducer;
