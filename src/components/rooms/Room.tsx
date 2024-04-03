import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { roomStyle } from "../../styles/roomStyle";
import { colors } from "../../styles/colors";
import { useSelector } from 'react-redux';
import { selectUser } from "../../redux/reducers/userSlice";
import { RootStackParamList } from "../Main";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { globalStyle } from "../../styles/global";
import { MemoizedMessage } from "./Message";
import { useAppDispatch } from "../../redux/store/store";
import { fetchNextMessages, getRoomMessagesSnapshot, sendMessage } from "../../services/RoomService";
import { MessageType, selectRoomMessages, setRoomMessages } from "../../redux/reducers/messageSlice";
import { debounce } from "../../utils/helpers";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "Room">;

const Room = ({ route }: NavigationProps): React.JSX.Element => {
    const { room_id } = route.params;

    const [lastDocument, setLastDocument] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>>();
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [chatMessage, setChatMessage] = useState<string>("");

    const appDispatch = useAppDispatch();
    const user = useSelector(selectUser);
    const messagesSelector = useSelector(selectRoomMessages(room_id));

    const handleClick = () => {
        if (chatMessage.length === 0) {
            return
        }
        Keyboard.dismiss();

        sendMessage(room_id, chatMessage, user)
            .then(() => setChatMessage(""))
            .catch((err) => console.error(err));
    };

    const fetchMoreMessages = () => {
        if (lastDocument === undefined || isLoadingMessages) {
            return;
        }
        setIsLoadingMessages(true);
        fetchNextMessages(room_id, lastDocument)
            .then(data => {
                setLastDocument(data.lastDocument);
                setMessages(prev => [...data.messages, ...prev]);
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoadingMessages(false))
    };

    const debounceFetchMoreMessages = debounce(() => fetchMoreMessages());

    useEffect(() => {
        console.log("message length", messages.length);
    }, [messages]);

    useEffect(() => {
        const onNextCB = (snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>) => {
            setLastDocument(() => snapshot.docs[snapshot.docs.length - 1]);
            const docChanges = snapshot.docChanges();

            // Return if its not the initial load
            if (docChanges.length > 1 && messages.length > 0) {
                return;
            }

            const snapshotMessages: MessageType[] = [];

            // Use data in global storage if available, otherwise fetch it
            if (docChanges.length > 1 && messagesSelector) {
                snapshotMessages.push(...messagesSelector);
            } else {
                docChanges.forEach(querySnapshot => {
                    if (querySnapshot.type === "added") {
                        const data = querySnapshot.doc.data();
                        const message = {
                            ...data,
                            date_created: data.date_created.toDate().toString(),
                            message_id: querySnapshot.doc.id
                        } as MessageType;
                        snapshotMessages.push(message);
                    }
                });
                appDispatch(setRoomMessages({ room_id, messages: snapshotMessages }));
            }

            setMessages(prev => {
                console.log(prev.length)
                console.log(snapshotMessages.length)
                return [...prev, ...snapshotMessages.reverse()]
            });
        }

        // TO-DO Fix bug with limit
        let fetchLimit = 50;
        if (messagesSelector) {
            fetchLimit = 17;
        }

        const unsubscribe = getRoomMessagesSnapshot({ room_id, fetchLimit, onNextCB });

        return () => unsubscribe();

    }, []);

    const renderItem = useCallback(({ item }: { item: MessageType }) => (
        <MemoizedMessage item={item} user={user} />
    ), []);

    return (
        <>
            {isLoadingMessages && (
                <View style={[globalStyle.activityIndicator, { marginTop: 30 }]}>
                    <ActivityIndicator size={50} color="#0000ff" />
                </View>
            )}
            <FlatList
                contentContainerStyle={roomStyle.chatFlatList}
                overScrollMode="never"
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item: MessageType) => item.message_id}
                inverted
                onEndReachedThreshold={0.8}
                onEndReached={debounceFetchMoreMessages}
            />
            <View style={roomStyle.chatInputWrapper}>
                <TextInput
                    style={roomStyle.chatInputField}
                    placeholder="Aa"
                    placeholderTextColor={"gray"}
                    onChangeText={text => setChatMessage(text)}
                    defaultValue={chatMessage}
                />
                <TouchableOpacity style={[roomStyle.chatButton, colors.blueBackgroundColor]} onPress={handleClick} disabled={chatMessage.length === 0}>
                    <Text style={[roomStyle.chatButtonText, colors.whiteTextColor]}>Send</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Room;