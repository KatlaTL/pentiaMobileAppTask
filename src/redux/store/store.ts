import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/userSlice';
import appReducer from '../reducers/appSlice'
import { useDispatch } from 'react-redux';

const store = configureStore({
    reducer: {
        user: userReducer.reducer,
        app: appReducer.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () =>  useDispatch<AppDispatch>();

export default store;