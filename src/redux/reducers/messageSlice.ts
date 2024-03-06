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
    [room_id: string]: {
        messages: MessageType[],
        lastDocument: string 
    }
}

const initialState: SliceState = {}


const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setRoomMessages: (state, action: PayloadAction<{ room_id: string, messages: MessageType[] }>) => {
            return {
                [action.payload.room_id]: {
                    messages: [...(state[action.payload.room_id]?.messages || []), ...action.payload.messages],
                    lastDocument: ""
                }
            }
        },
        setLastDocument: (state, action: PayloadAction<{ room_id: string, lastDocument: string }>) => {
            return {
                [action.payload.room_id]: {
                    messages: [...(state[action.payload.room_id]?.messages || [])],
                    lastDocument: action.payload.lastDocument
                }
            }
        }
    }
})

export const { setRoomMessages, setLastDocument } = messageSlice.actions;

export const selectRoomMessages = (room_id: string) => (state: RootState) => state.messages[room_id]?.messages
export const selectLastDocument = (room_id: string) => (state: RootState) => state.messages[room_id]?.lastDocument;

export default messageSlice;