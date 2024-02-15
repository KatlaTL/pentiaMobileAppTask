import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';

const useSignedInStatus = (setInitializing?: (initializing: boolean) => void) => {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(userState => {
            setUser(userState);
            if (setInitializing) {
                setInitializing(false);
            }
        })

        return unsubscribe;
    }, [])

    return user;
}

export default useSignedInStatus;