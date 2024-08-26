import { createContext, useContext, useReducer } from "react"

type ReducerStateType = {
    notificationURL: string | null;
    requiresAuth: boolean | null;
}

const reducerInitialState: ReducerStateType = {
    notificationURL: null,
    requiresAuth: null
}

export type NotificationStateType = {
    notificationState: ReducerStateType;
    actionsDispatch: {
        notificationURL: (url: string) => void,
        requiresAuth: (authRequired: boolean, url: string) => void,
        reset: () => void
    } | null
}

const contextInitialState: NotificationStateType = {
    notificationState: reducerInitialState,
    actionsDispatch: null
}

const NotificationContext = createContext<NotificationStateType>(contextInitialState);


const notificationReducer = (state, action) => {
    switch (action.type) {
        case "notificationURL":
            return {
                ...state,
                notificationURL: action.notificationURL
            };
        case "requiresAuth":
            return {
                ...state,
                notificationURL: action.notificationURL,
                requiresAuth: action.requiresAuth
            };
        case "reset":
            return {
                ...reducerInitialState
            }
        default:
            console.error('Unknow action: ' + action.type);
    }
}

/**
 * Notification Provider.
 * Used to store a notification URL while the app is loading or the user is signing in.
 * @param children 
 */
export const NotificationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, reducerInitialState);

    const actionDispatch = {
        notificationURL: (url: string) => dispatch({
            type: "notificationURL",
            notificationURL: url
        }),
        requiresAuth: (authRequired: boolean, url: string) => dispatch({
            type: "requiresAuth",
            requiresAuth: authRequired,
            notificationURL: url || null
        }),
        reset: () => dispatch({ type: "reset" })
    }

    return (
        <NotificationContext.Provider
            value={{
                actionsDispatch: actionDispatch,
                notificationState: state
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