import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/userSlice';
import { useDispatch } from 'react-redux';
import roomListSlice from '../reducers/chatRoomListSlice';
import messageSlice from '../reducers/messageSlice';

const store = configureStore({
    reducer: {
        user: userReducer.reducer,
        chatRoomList: roomListSlice.reducer,
        messages: messageSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () =>  useDispatch<AppDispatch>();

export default store;