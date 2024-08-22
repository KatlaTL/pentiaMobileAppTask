import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { sendMessage } from './ChatRoomService';
import { UserType } from '../redux/reducers/userSlice';

/**
 * Saves an image in Firebase storage and then the URL in Firestore
 * @param chat_id 
 * @param user 
 * @param fromLibrary - Boolean that decides if the image should be uploaded from the image library or a new image should be taken with the camera
 */
export const uploadImage = async (chat_id: string, user: UserType | null, fromLibrary: boolean): Promise<void> => {
    try {
        let result;

        if (fromLibrary) {
            result = await launchImageLibrary({
                mediaType: "photo"
            });
        } else {
            result = await launchCamera({
                mediaType: "photo",
                saveToPhotos: true
            });
        }

        if (!result || result.didCancel) {
            return;
        } else if (result.errorCode) {
            throw result.errorCode;
        }

        await result.assets?.forEach((async (file) => {
            if (!file.uri || !file.fileName) {
                return;
            }

            const url = await storeImageInFirebase(file.fileName, file.uri);

            if (url) {
                await sendMessage(chat_id, url, user, "image");
            }
        }));

    } catch (err) {
        console.error(err); // TO-DO handle exception
    }
}

/**
 * Save a file in Firebase storage
 * @param fileName 
 * @param filePath 
 * @returns - URL to firebase storage
 */
const storeImageInFirebase = async (fileName: string, filePath: string): Promise<string> => {
    try {
        const reference = storage().ref(fileName);

        return new Promise((resolve, reject) => {
            reference.putFile(filePath)
                .then(async () => {
                    await storage().ref(fileName).getDownloadURL()
                        .then(url => resolve(url))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });

    } catch (err) {
        throw err;
    }
}