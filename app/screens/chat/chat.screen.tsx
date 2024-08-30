import React, { useEffect, useLayoutEffect, useState } from "react";
import { Keyboard } from "react-native";
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { selectUser } from "../../redux/reducers/userSlice";
import { useAppDispatch } from "../../redux/store/store";
import { createMessageObject, getMoreMessagesAfterLastDocument, getChatRoomMessagesSnapshot, sendMessage, getChatRoomName } from "../../services/ChatRoomService";
import { MessageType, loadMoreRoomMessages, selectRoomLastDocID, selectRoomMessages, setRoomMessages } from "../../redux/reducers/messageSlice";
import { debounce } from "../../utils/helpers";
import { enableNotificationsForRoomID, sendNotificationOnNewMessage } from "../../services/NotificationService";
import { uploadImage } from "../../services/ImageService";
import { dialogueWithOK, dialogueWithTwoOptions } from "../../utils/dialogues";
import { ChatNavigationProps } from "../../navigators/app.navigator";
import { ChatPresentation } from "./_components/chat-presentation";
import errorMessages from "../../constants/errorMessages.json";

/**
 * Displays Chat Screen
 */
const ChatScreen = ({ route, navigation }: ChatNavigationProps): React.JSX.Element => {
    const { chat_id, chat_name } = route.params;

    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [chatMessage, setChatMessage] = useState<string>("");

    const appDispatch = useAppDispatch();
    const user = useSelector(selectUser);
    const messagesSelector = useSelector(selectRoomMessages(chat_id));
    const lastDocIDSelector = useSelector(selectRoomLastDocID(chat_id));

    /**
     * Uploads images to the chat.
     * Asks the user if they want to upload from photo gallery or use the camera to take a new picture.
     */
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

    /**
     * Sends a new message to the chat room.
     * Ask the user for permission to receive notifications for the specific chat room.
     * Sends notifications to all users who gave permissions.
     */
    const handleSendMessage = async () => {
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
            .catch(() => dialogueWithOK(errorMessages['failed-to-send-message'].title, errorMessages['failed-to-send-message'].message));
    };

    /**
     * Handles Firestore message snapshot.
     * Used as onSnapshot onNext CB.
     * Saves new mesages to the Room Messages list in the Redux Store reducer: messageSlice.ts.
     */
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

    /**
     * Loads more messages and saves them in the Redux Store reducer: messageSlice.ts.
     * Used with onEndReached on flatlist showing all the messages.
     */
    const fetchMoreMessages = () => {
        if ((lastDocIDSelector === "" || lastDocIDSelector === undefined) || isLoadingMessages) {
            return;
        }

        setIsLoadingMessages(true);

        getMoreMessagesAfterLastDocument(chat_id, lastDocIDSelector)
            .then(data => {
                appDispatch(loadMoreRoomMessages({ chat_id, messages: data.messages, lastDocID: data.lastDocumenID }));
            })
            .catch(() => dialogueWithOK(errorMessages['failed-to-load-more-messages'].title, errorMessages['failed-to-load-more-messages'].message))
            .finally(() => setIsLoadingMessages(false));
    };

    /**
     * Wrap the fetchMoreMessages in a debounce function to prevent overloading the Firestore API with unnecessary calls
     */
    const debounceFetchMoreMessages = debounce(() => fetchMoreMessages());

    /**
     * Start listening on the chat room messages Firestore snapshot
     */
    useEffect(() => {
        // Set fetchLimit to 3 if it's not the initial load. !important - FetchLimited most be a number above 2
        const fetchLimit = messagesSelector ? 3 : 50;

        const unsubscribe = getChatRoomMessagesSnapshot({ chat_id, fetchLimit, onNextCB: handleMessageSnapshot });

        return () => unsubscribe();
    }, [chat_id]);

    /**
     * Get the chat room name before the screen renders if chat_name param is undefined
     */
    useLayoutEffect(() => {
        if (!chat_name) {
            getChatRoomName(chat_id)
                .then(name => navigation.setOptions({ title: name }))
                .catch(() => navigation.setOptions({ title: "Chat" })); //Default name
        }
    }, [])
    

    return <ChatPresentation
        fetchMoreMessages={debounceFetchMoreMessages}
        handleSendMessage={handleSendMessage}
        isLoadingMessages={isLoadingMessages}
        messages={messagesSelector}
        onImagePicker={onImagePicker}
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        user={user}
    />

}

export default ChatScreen;