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
import { MessageType, loadMoreRoomMessages, selectRoomLastDocID, selectRoomMessages, setRoomMessages } from "../../redux/reducers/messageSlice";
import { debounce } from "../../utils/helpers";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "Room">;

const Room = ({ route }: NavigationProps): React.JSX.Element => {
    const { room_id } = route.params;

    const [lastDocument, setLastDocument] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>>();
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [chatMessage, setChatMessage] = useState<string>("");

    const appDispatch = useAppDispatch();
    const user = useSelector(selectUser);
    const messagesSelector = useSelector(selectRoomMessages(room_id));
    const lastDocIDSelector = useSelector(selectRoomLastDocID(room_id));

    const handleClick = () => {
        if (chatMessage.length === 0) {
            return
        }
        Keyboard.dismiss();

        sendMessage(room_id, chatMessage, user)
            .then(() => setChatMessage(""))
            .catch((err) => console.error(err));
    };

    const handleMessageSnapshot = async (snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>) => {
        setLastDocument(() => snapshot.docs[snapshot.docs.length - 1]);
        const docChanges = snapshot.docChanges();

        // Return if its the initial load and the rooms messages are found in Redux
        if (docChanges.length > 2 && messagesSelector) {
            return;
        }

        const snapshotMessages: MessageType[] = [];

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

        appDispatch(setRoomMessages({ room_id, messages: snapshotMessages.reverse() }));
    };

    const fetchMoreMessages = () => {
        if (lastDocument === undefined || isLoadingMessages) {
            return;
        }
        setIsLoadingMessages(true);
        fetchNextMessages(room_id, lastDocument)
            .then(data => {
                setLastDocument(data.lastDocument);
                /* setMessages(prev => [...data.messages, ...prev]); */
                appDispatch(loadMoreRoomMessages({ room_id, messages: data.messages }));
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoadingMessages(false))
    };

    const debounceFetchMoreMessages = debounce(() => fetchMoreMessages());

    useEffect(() => {
        // Set fetchLimit to 3 if it's not the initial load. !important - FetchLimited most be a number above 2
        const fetchLimit = messagesSelector ? 3 : 50;

        const unsubscribe = getRoomMessagesSnapshot({ room_id, fetchLimit, onNextCB: handleMessageSnapshot });

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
                data={messagesSelector}
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
                    onSubmitEditing={handleClick}
                />
                <TouchableOpacity style={[roomStyle.chatButton, colors.blueBackgroundColor]} onPress={handleClick} disabled={chatMessage.length === 0}>
                    <Text style={[roomStyle.chatButtonText, colors.whiteTextColor]}>Send</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Room;