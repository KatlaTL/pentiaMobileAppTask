import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import googleService from '../../android/app/google-services.json';
import { OAuthProvider, linkWithCredential } from '@firebase/auth';

type ErrorType = {
    code: string
}

export const onGoogleSignIn = async (): Promise<ErrorType | void> => {
    try {
        const clientID = googleService.client[0].oauth_client.filter(obj => obj.client_type === 3)[0].client_id;
        GoogleSignin.configure({
            webClientId: clientID
        })

        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();

        // Create a Firebase Google credential with the idToken
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        auth().signInWithCredential(googleCredential)
            .then(async (user) => {
                if (!user.user) throw "User doesn't exist";

                console.log("saving user in DB...")
                await firestore().collection("users").doc(user.user.uid).set({
                    email: user.user.email,
                    uid: user.user.uid,
                    user_name: user.user.displayName,
                    photo_url: user.user.photoURL,
                    date_created: new Date()
                });
            })
            .catch(err => {
                return err;
            });

    } catch (err) {
        console.error(err)
        throw err;
    }
}

export const onFacebookSignIn = async (): Promise<ErrorType | void> => {
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
        console.log(facebookCredential)
        // Sign-in the user with the credential
        const error = await auth().signInWithCredential(facebookCredential)
            .then(async (user) => {
                if (!user.user) throw "User doesn't exist";

                console.log("saving user in DB...")
                await firestore().collection("users").doc(user.user.uid).set({
                    email: user.user.email,
                    uid: user.user.uid,
                    user_name: user.user.displayName,
                    photo_url: user.user.photoURL,
                    date_created: new Date()
                });
            })
            .catch(err => {
                if (err.code === "auth/account-exists-with-different-credential") {
                    console.log("inside error")
                    
                }                
                return err;
            });

        if (error) {
            return { code: error.code }
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const signOut = (): void => {
    auth().signOut()
        .then(() => console.log("User has been logged out"))
        .catch(err => console.error("Can't log out", err));
}