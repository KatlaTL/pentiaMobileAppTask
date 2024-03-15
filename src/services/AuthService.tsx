import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AppDispatch } from '../redux/store/store';
import { Dispatch } from 'react';
import { ActionCreatorsType, ReducerAction } from '../hooks/useSignInForm';
import { login } from '../redux/reducers/userSlice';
import ErrorMessages from "../constants/errorMessages.json";

type AuthRegisterType = {
    email: string,
    password: string,
    userName?: string,
    appDispatch: AppDispatch,
    validate: {
        reducerDispatch: Dispatch<ReducerAction>,
        actionCreators: ActionCreatorsType
    }
}

export const register = ({ email, password, userName, appDispatch, validate }: AuthRegisterType): void => {
    auth().createUserWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
            if (userName) {
                await userCredential.user.updateProfile({
                    displayName: userName
                });
            }
        })
        .then(async () => {
            const user = auth().currentUser;
            if (!user) throw "User doesn't exist";

            await firestore().collection("users").doc(user.uid).set({
                email: user.email,
                uid: user.uid,
                user_name: user.displayName,
                photo_url: user.photoURL,
                date_created: new Date()
            });

            return user;
        })
        .then((user) => {
            appDispatch(
                login({
                    email: user.email,
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    notificationsEnabled: false
                }))
        })
        .catch((err) => {
            switch (err.code) {
                case "auth/invalid-email":
                    validate.reducerDispatch(validate.actionCreators.setError("email", "Invalid email address"));
                    break;
                case "auth/email-already-in-use":
                    validate.reducerDispatch(validate.actionCreators.setError("email", "Email address already in use"));
                    break;
                case "auth/weak-password":
                    validate.reducerDispatch(validate.actionCreators.setError("password", "Weak password"));
                    break;
                default:
                    console.error(err, "Unhandled error");
                    break;
            }
        });
}

export const signIn = ({ email, password, appDispatch, validate }: AuthRegisterType): void => {
    auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            appDispatch(
                login({
                    email: userCredential.user.email,
                    uid: userCredential.user.uid,
                    displayName: userCredential.user.displayName,
                    photoURL: userCredential.user.photoURL,
                    notificationsEnabled: false
                }))
        })
        .catch((err) => {
            switch (err.code) {
                case "auth/invalid-email":
                    validate.reducerDispatch(validate.actionCreators.setError("email", ErrorMessages['invalid-email']));
                    break;
                case "auth/invalid-credential":
                    validate.reducerDispatch(validate.actionCreators.setError("password", ErrorMessages['credentials-mismatch']));
                    break;
                default:
                    console.error(err, "Unhandled error");
                    break;
            }
        });
}

export const signOut = (): void => {
    auth().signOut()
        .then(() => console.log("User has been logged out"))
        .catch(err => console.error("Can't log out", err));
}