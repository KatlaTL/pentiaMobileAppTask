import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { ChatRoomListType } from '../redux/reducers/chatRoomListSlice';
import { MessageType } from '../redux/reducers/messageSlice';
import { UserType } from '../redux/reducers/userSlice';
import { dialogueWithOK } from '../utils/dialogues';
import errorMessages from "../constants/errorMessages.json";

/**
 * Get all chat rooms saved in Firestore
 * @returns List of chat rooms
 */
export const getAllChatRooms = async (): Promise<ChatRoomListType[]> => {
    try {
        const rooms = await firestore()
            .collection("rooms")
            .orderBy("date_last_message", "desc")
            .get();

        const newRooms: ChatRoomListType[] = [];

        rooms.forEach(value => {
            const data = value.data() as ChatRoomListType;
            newRooms.push({
                chat_name: data.chat_name,
                description: data.description,
                last_message: data.last_message,
                total_messages: data.total_messages,
                chat_id: value.id,
                date_last_message: value.data().date_last_message.toDate().toString(),
            } as ChatRoomListType)
        })

        return newRooms;
    } catch (err) {
        throw err;
    }
};

/**
 * Get a message subcollection of a chat room saved in Firestore 
 * @param roomID 
 * @param docID 
 * @returns document snapshot
 */
export const getChatRoomSubCollectionDocByID = (roomID: string, docID: string): Promise<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>> => {
    return firestore()
        .collection("rooms")
        .doc(roomID)
        .collection("messages")
        .doc(docID)
        .get()
        .then(snapshot => snapshot)
        .catch(err => {
            throw err;
        });
};

type FetchMessagesSnapshotOptionsType = {
    chat_id: string,
    fetchLimit?: number,
    onNextCB: (snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>) => void,
    onErrorCB?: (error: Error) => void
};

/**
 * Listening on Firestore chat room messages snapshot
 * @param chat_id - The Chat rooms ID
 * @param fetchLimit important! - fetchLimit most be a number above 2 - TODO add error handling for it
 * @param onNextCB - A callback to be called every time a new querysnapshot is available
 * @param onErrorCB - A callback to be called if the listen fails or is cancelled
 * @returns {Function} Returns an unsubscribe function to stop listening to events
 */
export const getChatRoomMessagesSnapshot = ({ chat_id, fetchLimit = 50, onNextCB, onErrorCB }: FetchMessagesSnapshotOptionsType): () => void => {
    return firestore()
        .collection("rooms")
        .doc(chat_id)
        .collection("messages")
        .orderBy("date_created", "desc")
        .limit(fetchLimit)
        .onSnapshot((querySnapshot) => {
            onNextCB(querySnapshot)
        }, (err) => {
            if (typeof onErrorCB === "function") {
                onErrorCB(err);
            }

            dialogueWithOK(errorMessages['failed-to-load-messages'].title, errorMessages['failed-to-load-messages'].message);
        });
};

type FetchNextMessagesType = {
    messages: MessageType[],
    lastDocumenID: string
};

/**
 * Get an amount of messages based on the limited param, starting after the last document
 * @param chat_id 
 * @param lastDocumenID - ID of the last document previous fetched
 * @param limit - Amount of messages that should be fetched. Default is 20.
 * @returns List of messages and the lastDocumentID
 */
export const getMoreMessagesAfterLastDocument = async (chat_id: string, lastDocumenID: string, limit: number = 20): Promise<FetchNextMessagesType> => {
    try {
        const lastDoc = await getChatRoomSubCollectionDocByID(chat_id, lastDocumenID);

        return firestore()
            .collection("rooms")
            .doc(chat_id)
            .collection("messages")
            .orderBy("date_created", "desc")
            .startAfter(lastDoc)
            .limit(limit)
            .get()
            .then((querySnapshot) => {
                const arr: MessageType[] = [];
                querySnapshot.forEach(snapshot => {
                    arr.push(createMessageObject(snapshot.data(), snapshot.id));
                });
                return {
                    lastDocumenID: querySnapshot.docs[querySnapshot.docs.length - 1]?.id || "",
                    messages: [...arr.reverse()]
                }
            })
            .catch(err => {
                throw err;
            })
    } catch (err) {
        throw err;
    }
};

/**
 * Runs a transaction to save a new message in Firestore for the given chat ID 
 */
export const sendMessage = (chat_id: string, content: string, user: UserType | null, type?: string): Promise<void> => {
    try {
        const roomReference = firestore().collection("rooms").doc(chat_id);

        return firestore().runTransaction(async transaction => {
            const roomSnapshot = await transaction.get(roomReference);

            if (!roomSnapshot.exists) {
                throw "Room does not exisit";
            }

            transaction.set(roomReference.collection("messages").doc(), {
                content: content,
                date_created: firestore.FieldValue.serverTimestamp(),
                type: type || "text",
                uid: user?.uid,
                user_name: user?.displayName
            });

            transaction.update(roomReference, {
                total_messages: firestore.FieldValue.increment(1),
                date_last_message: firestore.FieldValue.serverTimestamp()
            });
        })
            .then(() => Promise.resolve())
            .catch(err => {
                throw err
            });
    } catch (err) {
        throw err;
    }
};

/**
 * Construct a message object
 */
export const createMessageObject = (data: FirebaseFirestoreTypes.DocumentData, messageID: string): MessageType => {
    return {
        ...data,
        date_created: data.date_created.toDate().toString(),
        message_id: messageID
    } as MessageType;
};

/**
 * Add a user to the notification subscriber list of a chat room
 */
export const addUserToChatRoomSubscriberList = async (roomID: string, userID: string): Promise<void | { error: any }> => {
    try {
        await firestore().collection("rooms").doc(roomID).update({
            subscribers_uid: firestore.FieldValue.arrayUnion(userID)
        });
    } catch (err) {
        return {
            error: err
        }
    }
};

type ChatRoomSubscriberListReturnType = {
    subscribersList: string[] | null,
    error: any | null
};

/**
 *  Get the list of all subscribers for a chat room
 */
export const getChatRoomSubscriberList = async (roomID: string): Promise<ChatRoomSubscriberListReturnType> => {
    return await firestore()
        .collection("rooms")
        .doc(roomID)
        .get()
        .then(room => {
            if (!room) throw "Room doesn't exist";

            return {
                subscribersList: room.data()?.subscribers_uid || [] as string[],
                error: null
            }
        })
        .catch(err => {
            return {
                subscribersList: null,
                error: err
            }
        })
};