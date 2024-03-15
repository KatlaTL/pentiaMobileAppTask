import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export type UserType = {
    email: string | null,
    uid: string,
    displayName: string | null,
    photoURL: string | null,
    notificationsEnabled: boolean
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
        },
        toggleNotifications: state => {
            if (state.user) {
                state.user.notificationsEnabled = !state.user.notificationsEnabled;
            }
        }
    }
})

export const { login, logout, toggleNotifications } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default userSlice;