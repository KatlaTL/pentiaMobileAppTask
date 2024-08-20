import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { roomStyle } from "../../assets/styles/roomStyle";
import { colors } from "../../assets/styles/colors";
import { useSelector } from 'react-redux';
import { selectUser } from "../../redux/reducers/userSlice";
import { RootStackParamList } from "../../components/Main";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { globalStyle } from "../../assets/styles/global";
import { MemoizedMessage } from "./_components/message";
import { useAppDispatch } from "../../redux/store/store";
import { createMessageObject, getMoreMessagesAfterLastDocument, getRoomMessagesSnapshot, sendMessage } from "../../services/RoomService";
import { MessageType, loadMoreRoomMessages, selectRoomLastDocID, selectRoomMessages, setRoomMessages } from "../../redux/reducers/messageSlice";
import { debounce } from "../../utils/helpers";
import { enableNotificationsForRoomID, sendNotificationOnNewMessage } from "../../services/NotificationService";
import { uploadImage } from "../../services/ImageService";
import { dialogueWithTwoOptions } from "../../utils/dialogues";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "Chat">;

const ChatScreen = ({ route }: NavigationProps): React.JSX.Element => {
    const { chat_id } = route.params;

    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [chatMessage, setChatMessage] = useState<string>("");

    const appDispatch = useAppDispatch();
    const user = useSelector(selectUser);
    const messagesSelector = useSelector(selectRoomMessages(chat_id));
    const lastDocIDSelector = useSelector(selectRoomLastDocID(chat_id));

    const onImagePicker = async () => {
        dialogueWithTwoOptions({
            title: "Upload Photo",
            message: "Upload a photo from the gallery or take a new photo with your camera",
            optionOne: {
                text: "Go to gallery",
                onPress: async () => await uploadImage(chat_id, user, true)
            },
            optionTwo: {
                text: "Go to camera",
                onPress: async () => await uploadImage(chat_id, user, false)
            }
        });
    }

    const handleClick = async () => {
        if (chatMessage.length === 0) {
            return
        }

        Keyboard.dismiss();

        sendMessage(chat_id, chatMessage, user)
            .then(async () => {
                setChatMessage("");

                // Enable notifications if the user gives permission
                await enableNotificationsForRoomID(chat_id, user?.uid || "");

                // Send notification to users who gave permission
                await sendNotificationOnNewMessage(chat_id);
            })
            .catch((err) => console.error(err)); // TO-DO handle exceptions
    };

    const handleMessageSnapshot = async (snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>) => {
        const docChanges = snapshot.docChanges();

        // Return if its the initial load and the rooms messages are found in Redux
        if (docChanges.length > 2 && messagesSelector) {
            return;
        }

        const snapshotMessages: MessageType[] = [];
        let lastDocID;

        docChanges.forEach((querySnapshot, index) => {
            if (querySnapshot.type === "added") {
                snapshotMessages.push(createMessageObject(querySnapshot.doc.data(), querySnapshot.doc.id));
            }

            // Save the lastDocID from the initial load
            if (index === docChanges.length - 1 && docChanges.length > 2) {
                lastDocID = querySnapshot.doc.id;
            }
        });

        appDispatch(setRoomMessages({ chat_id, messages: snapshotMessages.reverse(), lastDocID }));
    };

    const fetchMoreMessages = () => {
        if ((lastDocIDSelector === "" || lastDocIDSelector === undefined) || isLoadingMessages) {
            return;
        }

        setIsLoadingMessages(true);

        getMoreMessagesAfterLastDocument(chat_id, lastDocIDSelector)
            .then(data => {
                appDispatch(loadMoreRoomMessages({ chat_id, messages: data.messages, lastDocID: data.lastDocumenID }));
            })
            .catch(err => console.error(err)) // TO-DO handle exceptions
            .finally(() => setIsLoadingMessages(false))
    };

    const debounceFetchMoreMessages = debounce(() => fetchMoreMessages());

    useEffect(() => {
        // Set fetchLimit to 3 if it's not the initial load. !important - FetchLimited most be a number above 2
        const fetchLimit = messagesSelector ? 3 : 50;

        const unsubscribe = getRoomMessagesSnapshot({ chat_id, fetchLimit, onNextCB: handleMessageSnapshot });

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
                <TouchableOpacity style={[roomStyle.uploadPhoto, colors.purpleBackgroundColor]} onPress={onImagePicker}>
                    <Text style={[roomStyle.uploadPhotoText, colors.whiteTextColor]}>Upload Photo</Text>
                </TouchableOpacity>
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

export default ChatScreen;