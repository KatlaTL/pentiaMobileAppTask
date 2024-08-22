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

/**
 * Messages actions.
 * setRoomMessages adds payload of messages to an existing chat room or creates a new if it doesn't already exisit in state.
 * loadMoreRoomMessages adds new payload of messages to the start of the messages list.
 */
export const { setRoomMessages, loadMoreRoomMessages } = messageSlice.actions;

/**
 * @param chat_id 
 * @returns Returns all messages of a chat room 
 */
export const selectRoomMessages = (chat_id: string) => (state: RootState) => state.messages[chat_id]?.messages;

/**
 * @param chat_id 
 * @returns Returns the lastDoCID of a chat room
 */
export const selectRoomLastDocID = (chat_id: string) => (state: RootState) => state.messages[chat_id]?.lastDocID;

export default messageSlice;