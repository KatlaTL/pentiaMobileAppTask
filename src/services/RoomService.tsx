import firestore from '@react-native-firebase/firestore';
import { RoomListType } from '../redux/reducers/roomListSlice';
import { MessageType, setLastDocument, setRoomMessages } from '../redux/reducers/messageSlice';
import { AppDispatch } from '../redux/store/store';
import { Dispatch, SetStateAction } from 'react';

export const getRoomList = async (): Promise<RoomListType[]> => {
    try {
        const rooms = await firestore().collection("rooms").orderBy("date_created").get();
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
        throw (err);
    }
}

export type fetchMessagesSnapshotOptions = {
    room_id: string,
    fetchLimit: number,
    appDispatch: AppDispatch,
    setLastDocument: Dispatch<SetStateAction<object>>
}

export const getRoomMessagesSnapshot = ({ room_id, fetchLimit, appDispatch, setLastDocument }: fetchMessagesSnapshotOptions): () => void => {
    return firestore()
        .collection("rooms")
        .doc(room_id)
        .collection("messages")
        .orderBy("date_created", "desc")
        .limit(fetchLimit)
        .onSnapshot((snapshot) => {
            setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
            const messages: MessageType[] = [];
            snapshot.docChanges().forEach(change => {
                if (change.type === "added") {
                    const data = change.doc.data();
                    const message = {
                        ...data,
                        date_created: data.date_created.toDate().toString(),
                        message_id: change.doc.id
                    } as MessageType;
                    messages.push(message);
                }
            });
            appDispatch(setRoomMessages({ room_id, messages: messages.reverse() }));
        }, (err) => console.log(err));
}