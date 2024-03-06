import auth from '@react-native-firebase/auth';

export const signOut = async (): Promise<void> => {
    auth().signOut()
        .then(() => console.log("User has been logged out"))
        .catch(err => console.error("Can't log out", err));
}