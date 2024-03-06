import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export type MessageType = {
    content: string,
    date_created: string,
    type: string,
    uid: string,
    user_name: string,
    message_id: string
}

type SliceState = {
    [room_id: string]: MessageType[]
}

const initialState: SliceState = {}


const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setRoomMessages: (state, action: PayloadAction<{ room_id: string, messages: MessageType[] }>) => {
            return {
                [action.payload.room_id]: [...(state[action.payload.room_id]?.slice(1) || []), ...action.payload.messages]
            }
        }
    }
})

export const { setRoomMessages } = messageSlice.actions;

export const selectRoomMessages = (room_id: string) => (state: RootState) => state.messages[room_id];

export default messageSlice;