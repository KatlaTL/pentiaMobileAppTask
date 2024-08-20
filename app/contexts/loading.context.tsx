import { createContext, useContext } from "react"
import useAuth from "../hooks/useAuth";


type LoadingStateType = {
    isLoaded: boolean
}

const initialState = {
    isLoaded: false
}

const LoadingContext = createContext<LoadingStateType>(initialState);

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

export const useLoadingContext = () => {
    const context = useContext(LoadingContext);

    if (context === undefined) {
        throw new Error('useLoadingContext must be used within a LoadingProvider');
    }

    return context;
}