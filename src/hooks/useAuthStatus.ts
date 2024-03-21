import auth from '@react-native-firebase/auth';
import { useEffect, } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/store/store';
import { UserType, login, logout, selectUser } from '../redux/reducers/userSlice';
import { setInitializing, selectInitializing } from '../redux/reducers/appSlice';

type AuthStatus = {
    user: UserType | null,
    initializing: boolean
}

const useAuthStatus = (): AuthStatus => {
    const appDispatch = useAppDispatch();
    const user = useSelector(selectUser);
    const initializing = useSelector(selectInitializing)

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(userState => {
            console.log("userState")
            if (userState) {
                console.log(userState)
                appDispatch(
                    login({
                        email: userState.email,
                        uid: userState.uid,
                        displayName: userState.displayName,
                        photoURL: userState.photoURL,
                        notificationsEnabled: false
                    }))
            } else {
                appDispatch(logout());
            }

            appDispatch(setInitializing(false));
        })

        return unsubscribe;
    }, [])

    return { user, initializing };
}

export default useAuthStatus;