import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import googleService from '../../android/app/google-services.json';
import { dialogueWithOK } from '../utils/dialogues';
import errorMessages from "../constants/errorMessages.json"
import { getFCMDeviceToken } from './NotificationService';
import { UserType } from '../redux/reducers/userSlice';

type SignInErrorType = {
    error: FirebaseAuthTypes.NativeFirebaseAuthError | null,
}

export const onStateChange = (cb: FirebaseAuthTypes.AuthListenerCallback) => auth().onAuthStateChanged(cb);

export const onGoogleSignIn = async (): Promise<SignInErrorType> => {
    try {
        const clientID = googleService.client[0].oauth_client.filter(obj => obj.client_type === 3)[0].client_id;
        GoogleSignin.configure({
            webClientId: clientID
        })

        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        // Get the users ID token
        const { idToken, user } = await GoogleSignin.signIn();

        // Create a Firebase Google credential with the idToken
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        const error = await signInUserWithCredential(googleCredential);

        if (error?.code) {
            switch (error.code) {
                case "auth/account-exists-with-different-credential":
                    await linkAccountWithDifferentProviders(user.email, googleCredential);
                    break;
                case "auth/user-disabled":
                    dialogueWithOK(errorMessages['account-disabled'].title, errorMessages['account-disabled'].message);
                    break;
                default:
                    dialogueWithOK(errorMessages['something-went-wrong'].title, errorMessages['something-went-wrong'].message);
                    break;
            }
        }

        return { error };

    } catch (err) {
        dialogueWithOK(errorMessages['something-went-wrong'].title, errorMessages['something-went-wrong'].message);
        return { error: err as FirebaseAuthTypes.NativeFirebaseAuthError };
    }
}

export const onFacebookSignIn = async (): Promise<SignInErrorType> => {
    try {
        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }

        // Once signed in, get the users AccessToken
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            throw 'Something went wrong obtaining access token';
        }

        // Create a Firebase Facebook credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

        // Sign-in the user with the credential
        const error = await signInUserWithCredential(facebookCredential);

        if (error?.code) {
            switch (error.code) {
                case "auth/account-exists-with-different-credential":
                    //WORKAROUND - on Android the email field is not retrieved even with logInWithPermissions(['email'])
                    const response = await fetch(`https://graph.facebook.com/me?fields=email&access_token=${data.accessToken}`);
                    const { email } = await response.json();

                    await linkAccountWithDifferentProviders(email, facebookCredential);

                    break;
                case "auth/user-disabled":
                    dialogueWithOK(errorMessages['account-disabled'].title, errorMessages['account-disabled'].message);
                    break;
                default:
                    dialogueWithOK(errorMessages['something-went-wrong'].title, errorMessages['something-went-wrong'].message);
                    break;
            }
        }

        return { error };
    } catch (err) {
        dialogueWithOK(errorMessages['something-went-wrong'].title, errorMessages['something-went-wrong'].message);
        return { error: err as FirebaseAuthTypes.NativeFirebaseAuthError };
    }
}

const signInUserWithCredential = async (credential: FirebaseAuthTypes.AuthCredential): Promise<null | FirebaseAuthTypes.NativeFirebaseAuthError> => {
    // Sign-in the user with the credential
    return auth().signInWithCredential(credential)
        .then(async (user) => {
            if (!user.user) throw "User doesn't exist";

            // Get FCM device token and save it on the user
            const FCMToken = await getFCMDeviceToken();

            // Save the user in firestore
            await firestore().collection("users").doc(user.user.uid).set({
                email: user.user.email,
                uid: user.user.uid,
                user_name: user.user.displayName,
                photo_url: user.user.photoURL,
                date_created: new Date(),
                ...(FCMToken && { FCMToken })
            });

            // Return null if no errors occurred
            return null;
        })
        .catch(err => err);
}

const linkAccountWithDifferentProviders = async (email: string, credentialToLink: FirebaseAuthTypes.AuthCredential) => {
    try {
        // Get the account current login providers
        const userSignInMethods = await auth().fetchSignInMethodsForEmail(email);
        let error: SignInErrorType = { error: null };

        // Login to the first provider found
        switch (userSignInMethods[0]) {
            case "google.com":
                error = await onGoogleSignIn();
                break;
            case "facebook.com":
                error = await onFacebookSignIn();
                break;
        }

        // If Success link the new provider to the account
        if (!error?.error) {
            await auth().currentUser?.linkWithCredential(credentialToLink);
        } else {
            dialogueWithOK(errorMessages['something-went-wrong'].title, errorMessages['something-went-wrong'].message);
        }
    } catch (err) {
        throw err;
    }
}

export const signOut = (): void => {
    auth().signOut()
        .then(() => console.log("User has been logged out"))
        .catch(err => console.error("Can't log out", err));
}

type UserReturnType = {
    user: UserType | null,
    error: any | null
}

export const getUserByID = async (userID: string): Promise<UserReturnType> => {
    return await firestore()
        .collection("users")
        .doc(userID)
        .get()
        .then(user => {
            if (!user) throw "User doesn't exist";
            return {
                user: {
                    ...user.data()
                } as UserType,
                error: null
            };
        })
        .catch(err => {
            return {
                user: null,
                error: err
            }
        });
}

export const updateUserByID = async (userID: string, data): Promise<void | { error: any }> => {
    try {
        await firestore().collection("users").doc(userID).update(data);
    } catch (err) {
        return {
            error: err
        }
    }
}

export const getAllFCMTokensByUserIDs = async (userIDs: string[]): Promise<string[]> => {
    try {
        const tokenArray: string[] = [];

        const data = await firestore()
            .collection("users")
            .where(firestore.FieldPath.documentId(), "in", userIDs)
            .get();

        data.docs.forEach(snapshot => {
            const data = snapshot.data();
            if (data.FCMToken) {
                tokenArray.push(data.FCMToken);
            }
        })

        return tokenArray;
    } catch (err) {
        console.error(err);
        return [];
    }
}