import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

type SliceState = {
    initializing: boolean
}

const initialState: SliceState = {
    initializing: true
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setInitializing: (state, action: PayloadAction<boolean>) => {
            state.initializing = action.payload;
        }
    }
})

export const { setInitializing } = appSlice.actions;

export const selectInitializing = (state: RootState) => state.app.initializing;

export default appSlice;