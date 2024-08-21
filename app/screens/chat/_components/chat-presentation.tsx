import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useCallback } from "react"
import { globalStyle } from "../../../assets/styles/global"
import { roomStyle } from "../../../assets/styles/roomStyle"
import { colors } from "../../../assets/styles/colors"
import { MemoizedMessage } from "./message"
import { MessageType } from "../../../redux/reducers/messageSlice"
import { UserType } from "../../../redux/reducers/userSlice"

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
                <TouchableOpacity style={[roomStyle.uploadPhoto, colors.purpleBackgroundColor]} onPress={onImagePicker}>
                    <Text style={[roomStyle.uploadPhotoText, colors.whiteTextColor]}>Upload Photo</Text>
                </TouchableOpacity>
                <TextInput
                    style={roomStyle.chatInputField}
                    placeholder="Aa"
                    placeholderTextColor={"gray"}
                    onChangeText={text => setChatMessage(text)}
                    defaultValue={chatMessage}
                    onSubmitEditing={handleSendMessage}
                />
                <TouchableOpacity style={[roomStyle.chatButton, colors.blueBackgroundColor]} onPress={handleSendMessage} disabled={chatMessage.length === 0}>
                    <Text style={[roomStyle.chatButtonText, colors.whiteTextColor]}>Send</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}