import { useEffect, useState, } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/store/store';
import { UserType, login, logout, selectUser } from '../redux/reducers/userSlice';
import { onStateChange } from '../services/AuthService';
import { getFCMDeviceToken } from '../services/NotificationService';

type AuthStateType = {
    user: UserType | null;
    isLoaded: boolean;
}

const isLoadedInitialState: boolean = false;

/**
 * Auth hook.
 * Listens on Firebase auth state change and updates the user object accordingly 
 * @returns {Object} { user: UserType | null, isLoaded: boolean }
 */
const useAuth = (): AuthStateType => {
    const appDispatch = useAppDispatch();
    const user = useSelector(selectUser);
    const [isLoaded, setIsLoaded] = useState<boolean>(isLoadedInitialState);

    useEffect(() => {
        const unsubscribe = onStateChange(async (userState) => {
            if (userState) {
                appDispatch(
                    login({
                        email: userState.email,
                        uid: userState.uid,
                        displayName: userState.displayName,
                        photoURL: userState.photoURL,
                        FCMToken: await getFCMDeviceToken()
                    }))
            } else {
                appDispatch(logout());
            }

            setIsLoaded(true);
        })

        return unsubscribe;
    }, [])


    return { user, isLoaded };
}

export default useAuth;