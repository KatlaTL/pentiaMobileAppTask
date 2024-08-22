import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export type UserType = {
    email: string | null,
    uid: string,
    displayName: string | null,
    photoURL: string | null,
    FCMToken: string
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

/**
 * User actions.
 * login saves the authorized user object in state.
 * logout removes the user.
 */
export const { login, logout } = userSlice.actions;

/**
 * @returns Returns the user object
 */
export const selectUser = (state: RootState) => state.user.user;

export default userSlice;