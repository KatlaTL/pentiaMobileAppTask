import { createContext, useContext } from "react"
import useAuth from "../hooks/useAuth";


type LoadingStateType = {
    isLoaded: boolean
}

const initialState = {
    isLoaded: false
}

const LoadingContext = createContext<LoadingStateType>(initialState);

/**
 * Loading Provider. Used to check if the app has fully loaded.
 * Check if the app has loaded by using the value isLoaded: boolean.
 * @param children 
 */
export const LoadingProvider = ({ children }) => {
    const { isLoaded } = useAuth();

    return (
        <LoadingContext.Provider
            value={{
                isLoaded: isLoaded
            }}>
            {children}
        </LoadingContext.Provider>
    )
}

/**
 * LoadingContext consumer
 * @returns values of LoadingContext: isLoaded: boolean
 */
export const useLoadingContext = () => {
    const context = useContext(LoadingContext);

    if (context === undefined) {
        throw new Error('useLoadingContext must be used within a LoadingProvider');
    }

    return context;
}