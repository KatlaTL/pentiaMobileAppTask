import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { RoomListType } from '../redux/reducers/roomListSlice';
import { MessageType } from '../redux/reducers/messageSlice';
import { UserType } from '../redux/reducers/userSlice';

export const getAllRooms = async (): Promise<RoomListType[]> => {
    try {
        const rooms = await firestore().collection("rooms").orderBy("date_last_message", "desc").get();
        const newRooms: RoomListType[] = [];
        rooms.forEach(value => {
            const data = value.data() as RoomListType;
            newRooms.push({
                room_name: data.room_name,
                description: data.description,
                last_message: data.last_message,
                total_messages: data.total_messages,
                room_id: value.id,
                date_last_message: value.data().date_last_message.toDate().toString(),
            } as RoomListType)
        })
        return newRooms;
    } catch (err) {
        console.error("Can't fetch rooms from firestore", err);
        throw err;
    }
};

export const getRoomSubCollectionDocByID = (roomID: string, docID: string): Promise<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>> => {
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

type fetchMessagesSnapshotOptions = {
    room_id: string,
    fetchLimit?: number,
    startAfterDocID?: string,
    onNextCB: (snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>) => void,
    onErrorCB?: (error: Error) => void
};

export const getRoomMessagesSnapshot = ({ room_id, fetchLimit = 50, onNextCB, onErrorCB }: fetchMessagesSnapshotOptions): () => void => {
    return firestore()
        .collection("rooms")
        .doc(room_id)
        .collection("messages")
        .orderBy("date_created", "desc")
        .limit(fetchLimit)
        .onSnapshot((querySnapshot) => {
            onNextCB(querySnapshot)
        }, (err) => {
            if (typeof onErrorCB === "function") {
                onErrorCB(err)
            }
            console.error(err);
        });
};

type fetchNextMessages = {
    messages: MessageType[],
    lastDocumenID: string
};

export const getMoreMessagesAfterLastDocument = async (room_id: string, lastDocumenID: string, limit: number = 20): Promise<fetchNextMessages> => {
    try {
        const lastDoc = await getRoomSubCollectionDocByID(room_id, lastDocumenID);

        return firestore()
            .collection("rooms")
            .doc(room_id)
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

export const sendMessage = (room_id: string, content: string, user: UserType | null, type?: string): Promise<void> => {
    try {

        const roomReference = firestore().collection("rooms").doc(room_id);

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

export const createMessageObject = (data: FirebaseFirestoreTypes.DocumentData, messageID: string): MessageType => {
    return {
        ...data,
        date_created: data.date_created.toDate().toString(),
        message_id: messageID
    } as MessageType;
};

export const addUserToRoomSubscriberList = async (roomID: string, userID: string): Promise<void | { error: any }> => {
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

type roomSubscriberListReturnType = {
    subscribersList: string[] | null,
    error: any | null
};

export const getRoomSubscriberList = async (roomID: string): Promise<roomSubscriberListReturnType> => {
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