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

export const fetchChatRoomList = createAsyncThunk("chatRoomList/fetchChatRoomList", async () => (await getAllChatRooms()) as ChatRoomListType[]);

export const { setChatRoomList } = roomListSlice.actions;

export const selectChatRoomList = (state: RootState) => state.chatRoomList.chatRoomsList;

export default roomListSlice;