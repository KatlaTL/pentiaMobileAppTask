import { useReducer } from "react"
import ErrorMessages from "../constants/errorMessages.json";

export type reducerAction = {
    type: string,
    value: string,
    inputName: string
}

export type reducerState = {
    [key: string]: {
        value: string,
        error: string | null
    }
}

const initialValue: reducerState = {
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

const useSignInForm = (initialState: reducerState = initialValue) => {
    const [reducerState, reducerDispatch] = useReducer((state: reducerState, action: reducerAction): reducerState => {
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

    const actionCreators = {
        setInputName: (inputName: string, value: string): reducerAction => {
            return {
                type: "inputName/set",
                inputName,
                value
            }
        },
        setError: (inputName: string, value: string): reducerAction => {
            return {
                type: "error/set",
                inputName,
                value
            }
        },
        removeError: (inputName: string): reducerAction => {
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