import { useReducer } from "react"
import ErrorMessages from "../constants/errorMessages.json";

export type ReducerAction = {
    type: string,
    value: string,
    inputName: string
}

export type ReducerState = {
    [key: string]: {
        value: string,
        error: string | null
    }
}

export type ActionCreatorsType = {
    setInputName: (inputName: string, value: string) => {
        type: string,
        inputName: string,
        value: string
    },
    setError: (inputName: string, value: string) => {
        type: string,
        inputName: string,
        value: string
    },
    removeError: (inputName: string) => {
        type: string,
        inputName: string,
        value: string
    }
}

const initialValue: ReducerState = {
    email: {
        value: "",
        error: null
    },
    password: {
        value: "",
        error: null
    },
    userName: {
        value: "",
        error: null
    }
}

const useSignInForm = (initialState: ReducerState = initialValue) => {
    const [reducerState, reducerDispatch] = useReducer((state: ReducerState, action: ReducerAction): ReducerState => {
        switch (action.type) {
            case "inputName/set":
                return {
                    ...state,
                    [action.inputName]: {
                        ...state[action.inputName],
                        value: action.value
                    }
                }
            case "error/set":
                return {
                    ...state,
                    [action.inputName]: {
                        ...state[action.inputName],
                        error: action.value
                    }
                }
            case "error/remove":
                return {
                    ...state,
                    [action.inputName]: {
                        ...state[action.inputName],
                        error: null
                    }
                }
        }
        throw Error("Unknow action: " + action.type); //Should be caught somewhere
    }, initialState)

    const actionCreators: ActionCreatorsType = {
        setInputName: (inputName: string, value: string): ReducerAction => {
            return {
                type: "inputName/set",
                inputName,
                value
            }
        },
        setError: (inputName: string, value: string): ReducerAction => {
            return {
                type: "error/set",
                inputName,
                value
            }
        },
        removeError: (inputName: string): ReducerAction => {
            return {
                type: "error/remove",
                inputName,
                value: ""
            }
        }
    }

    const validateForm = () => {
        let validationFailed = false;
        for (const [key, value] of Object.entries(reducerState)) {
            if (value.value.length === 0) {
                reducerDispatch(actionCreators.setError(key, ErrorMessages[key] || `${key} can't be empty`));
                validationFailed = true;
            } else {
                reducerDispatch(actionCreators.removeError(key));
            }
        }
        return validationFailed;
    }

    return { reducerState, reducerDispatch, actionCreators, validateForm };
}

export default useSignInForm;