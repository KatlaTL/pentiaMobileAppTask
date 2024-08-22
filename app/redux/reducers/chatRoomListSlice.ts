import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { getAllChatRooms } from "../../services/ChatRoomService";

export type ChatRoomListType = {
    chat_id: string,
    chat_name: string,
    description: string,
    total_messages: number,
    last_message: string,
    date_last_message: string
}

type SliceState = {
    chatRoomsList: ChatRoomListType[]
}

const initialState: SliceState = {
    chatRoomsList: []
}

const roomListSlice = createSlice({
    name: "chatRoom",
    initialState,
    reducers: {
        setChatRoomList: (state, action: PayloadAction<SliceState>) => {
            state.chatRoomsList = [...action.payload.chatRoomsList];
        }
    },
    //Handles the fetchChatRoomList promise and saves the payload to state on success
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatRoomList.fulfilled, (state, action) => {
                state.chatRoomsList = [...action.payload]
            })
            .addCase(fetchChatRoomList.rejected, (state, action) => {
                //TO-DO handle getAllChatRooms error here
            })
    }
})

/**
 * Load all the chat rooms from Firestore async
 * @returns {Promise}
 */
export const fetchChatRoomList = createAsyncThunk("chatRoomList/fetchChatRoomList", async () => (await getAllChatRooms()) as ChatRoomListType[]);

/**
 * chatRoomList actions.
 * setChatRoomList replaces the chat rooms list with a new list.
 */
export const { setChatRoomList } = roomListSlice.actions;

/**
 * @returns Returns the list of all chat rooms
 */
export const selectChatRoomList = (state: RootState) => state.chatRoomList.chatRoomsList;

export default roomListSlice;