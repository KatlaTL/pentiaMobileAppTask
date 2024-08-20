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
    [chat_id: string]: {
        messages: MessageType[],
        lastDocID: string
    }
}

const initialState: SliceState = {}


const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setRoomMessages: (state, action: PayloadAction<{ chat_id: string, messages: MessageType[], lastDocID: string }>) => {
            return {
                [action.payload.chat_id]: { 
                    messages: [...(state[action.payload.chat_id]?.messages || []), ...action.payload.messages],
                    lastDocID: action.payload.lastDocID || state[action.payload.chat_id]?.lastDocID
                }
            }
        },
        loadMoreRoomMessages: (state, action: PayloadAction<{ chat_id: string, messages: MessageType[], lastDocID: string }>) => {   
            return {
                [action.payload.chat_id]: {
                    messages: [...action.payload.messages, ...(state[action.payload.chat_id]?.messages || [])],
                    lastDocID: action.payload.lastDocID
                }
            }
        }
    }
})

export const { setRoomMessages, loadMoreRoomMessages } = messageSlice.actions;

export const selectRoomMessages = (chat_id: string) => (state: RootState) => state.messages[chat_id]?.messages;
export const selectRoomLastDocID = (chat_id: string) => (state: RootState) => state.messages[chat_id]?.lastDocID;

export default messageSlice;