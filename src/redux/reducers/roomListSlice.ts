import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { getRoomList } from "../../services/RoomService";

export type RoomListType = {
    room_id: string,
    room_name: string,
    description: string,
    total_messages: number,
    last_message: string,
    date_last_message: string
}

type SliceState = {
    roomsList: RoomListType[]
}

const initialState: SliceState = {
    roomsList: []
}

const roomListSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setRoomList: (state, action: PayloadAction<SliceState>) => {
            state.roomsList = [...action.payload.roomsList];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoomList.fulfilled, (state, action) => {
                state.roomsList = [...action.payload]
            })
    }
})

export const fetchRoomList = createAsyncThunk("roomList/fetchRoomList", async () => (await getRoomList()) as RoomListType[]);

export const { setRoomList } = roomListSlice.actions;

export const selectRoomList = (state: RootState) => state.roomList.roomsList;

export default roomListSlice;