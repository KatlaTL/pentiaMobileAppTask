import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useCallback } from "react"
import { globalStyle } from "../../../assets/styles/global"
import { roomStyle } from "../../../assets/styles/roomStyle"
import { colors } from "../../../assets/styles/colors"
import { MemoizedMessage } from "./message"
import { MessageType } from "../../../redux/reducers/messageSlice"
import { UserType } from "../../../redux/reducers/userSlice"
import { ChatButton } from "./chat-button"

type ChatPresentationType = {
    user: UserType | null;
    isLoadingMessages: boolean;
    messages: MessageType[];
    fetchMoreMessages: () => void;
    onImagePicker: () => Promise<void>;
    chatMessage: string;
    setChatMessage: (value: React.SetStateAction<string>) => void;
    handleSendMessage: () => Promise<void>;
}

/**
 * Chat Screen Presentation 
 */
export const ChatPresentation = ({ user, isLoadingMessages, messages, fetchMoreMessages, onImagePicker, chatMessage, setChatMessage, handleSendMessage }: ChatPresentationType): React.JSX.Element => {

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
                onEndReached={fetchMoreMessages}
            />
            <View style={roomStyle.chatInputWrapper}>
                <ChatButton
                    buttonText="Upload Photo"
                    onPress={onImagePicker}
                    style={[roomStyle.uploadPhoto, colors.purpleBackgroundColor]}
                    textStyle={[roomStyle.uploadPhotoText, colors.whiteTextColor]}
                />
                <TextInput
                    style={roomStyle.chatInputField}
                    placeholder="Aa"
                    placeholderTextColor={"gray"}
                    onChangeText={text => setChatMessage(text)}
                    defaultValue={chatMessage}
                    onSubmitEditing={handleSendMessage}
                />
                <ChatButton
                    buttonText="Send"
                    disabled={chatMessage.length === 0}
                    onPress={handleSendMessage}
                    style={[roomStyle.chatButton, colors.blueBackgroundColor]}
                    textStyle={[roomStyle.chatButtonText, colors.whiteTextColor]}
                />
            </View>
        </>
    )
}