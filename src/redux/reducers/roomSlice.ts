import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

type SliceState = {
    room_id: string | null
}

const initialState: SliceState = {
    room_id: null
}

const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setRoomId: (state, action: PayloadAction<SliceState>) => {
            state.room_id = action.payload.room_id;
        }
    }
})

export const { setRoomId } = roomSlice.actions;

export const selectRoomId = (state: RootState) => state.room.room_id;

export default roomSlice;