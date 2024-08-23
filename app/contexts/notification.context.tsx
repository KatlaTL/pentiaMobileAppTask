import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { listenForNotificationForeground } from "../services/NotificationService";
import useAuth from "../hooks/useAuth";
import { useLoadingContext } from "./loading.context";
import { Linking } from "react-native";

type NotificationStateType = {
    notificationURL: string | null;
    setNotificationURL: Dispatch<SetStateAction<string>>
}

const initialState: NotificationStateType = {
    notificationURL: null,
    setNotificationURL: () => null
}

const NotificationContext = createContext<NotificationStateType>(initialState);

export const NotificationProvider = ({ children }) => {
    const [notificationURL, setNotificationURL] = useState<string>("");
    const { isLoaded } = useLoadingContext();
    const { user } = useAuth();

    useEffect(() => {
        listenForNotificationForeground();
    }, [])

    useEffect(() => {
        console.log("isLoaded", isLoaded)
        console.log("user", user)
        console.log("notification hook", notificationURL);
        if (notificationURL && isLoaded && user) {
            Linking.openURL(notificationURL);
        }
    }, [notificationURL, isLoaded, user]);

    return (
        <NotificationContext.Provider
            value={{
                notificationURL: notificationURL,
                setNotificationURL: setNotificationURL
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}

/**
 * NotificationContext consumer
 * @returns values of NotificationContext: notificationURL: string | null
 */
export const useNotificationContext = () => {
    const context = useContext(NotificationContext);

    if (context === undefined) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }

    return context;
}