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
        lastDocID: string
    }
}

const initialState: SliceState = {}


const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setRoomMessages: (state, action: PayloadAction<{ room_id: string, messages: MessageType[], lastDocID: string }>) => {
            return {
                [action.payload.room_id]: { 
                    messages: [...(state[action.payload.room_id]?.messages || []), ...action.payload.messages],
                    lastDocID: action.payload.lastDocID || state[action.payload.room_id]?.lastDocID
                }
            }
        },
        loadMoreRoomMessages: (state, action: PayloadAction<{ room_id: string, messages: MessageType[], lastDocID: string }>) => {   
            return {
                [action.payload.room_id]: {
                    messages: [...action.payload.messages, ...(state[action.payload.room_id]?.messages || [])],
                    lastDocID: action.payload.lastDocID
                }
            }
        }
    }
})

export const { setRoomMessages, loadMoreRoomMessages } = messageSlice.actions;

export const selectRoomMessages = (room_id: string) => (state: RootState) => state.messages[room_id]?.messages;
export const selectRoomLastDocID = (room_id: string) => (state: RootState) => state.messages[room_id]?.lastDocID;

export default messageSlice;