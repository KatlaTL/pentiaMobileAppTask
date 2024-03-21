import React from 'react';
import { Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

const onFacebookButtonPress = async () => {
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

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

    // Sign-in the user with the credential
    auth().signInWithCredential(facebookCredential)
        .then(async (user) => {
            
            await firestore().collection("users").doc(user.user.uid).set({
                email: user.user.email,
                uid: user.user.uid,
                user_name: user.user.displayName,
                photo_url: user.user.photoURL,
                date_created: new Date()
            });
        })
        .catch(err => console.error(err));
}

const FacebookSignIn = (): React.JSX.Element => {
    return (
        <Button
            title="Facebook Sign-In"
            onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))}
        />
    );
}

export default FacebookSignIn;