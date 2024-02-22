import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export type UserType = {
    email: string | null,
    uid: string,
    displayName: string | null,
    photoURL: string | null,
    phoneNumber: string | null
}

type SliceState = {
    user: UserType | null
}

const initialState: SliceState = {
    user: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserType>) => {
            state.user = action.payload;
        },
        logout: state => {
            state.user = null;
        }
    }
})

export const { login, logout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default userSlice;