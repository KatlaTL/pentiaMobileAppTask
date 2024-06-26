import { memo } from "react";
import { colors } from "../../styles/colors";
import { roomStyle } from "../../styles/roomStyle";
import { Image, Text, View } from "react-native";
import { UserType } from "../../redux/reducers/userSlice";
import { MessageType } from "../../redux/reducers/messageSlice";
import { isSameDate } from "../../utils/helpers";
import ChatBubble from "./ChatBubble";

type Message = {
    item: MessageType,
    user: UserType | null
}

const Message = ({ item, user }: Message): React.JSX.Element => {
    const isSelf = item.uid === user?.uid;

    const today: Date = new Date();
    const messageDate: Date = new Date(item.date_created);
    const showTimeString: boolean = isSameDate(today, messageDate);

    const dateFormat: Intl.DateTimeFormatOptions = showTimeString ? {
        hour: "numeric",
        minute: "numeric",
        hour12: false
    } : {
        month: "short",
        year: "numeric",
        day: "numeric"
    };

    const formatedMessageDate: string = showTimeString ? messageDate.toLocaleTimeString("dk", dateFormat) : messageDate.toLocaleDateString("dk", dateFormat);

    return (
        <>
            {isSelf ? (
                <View style={roomStyle.spaceBetweenChatBubbles}>
                    <Text style={roomStyle.chatUserSelf}>{item.user_name}</Text>
                    <View style={roomStyle.chatBubbleContainerSelf}>
                        <Text style={roomStyle.chatMessageSelfDate}>{formatedMessageDate}</Text>

                        {item.type === "image" ? (
                            <Image style={roomStyle.uploadedImageSelf} source={{ uri: item.content }} />
                        ) : (
                            <ChatBubble
                                bubbleStyle={[roomStyle.chatSelfBubble, colors.chatBubbleSelfBackgroundColor]}
                                textStyle={[colors.blackTextColor, roomStyle.chatBubbleText]}
                                text={item.content}
                            />
                        )}

                        <Image style={roomStyle.chatAvartar} source={{ uri: user?.photoURL || undefined }} />
                    </View>
                </View>
            ) : (
                <View style={roomStyle.spaceBetweenChatBubbles}>
                    <Text style={roomStyle.chatUser}>{item.user_name}</Text>
                    <View style={roomStyle.chatBubbleContainer}>
                        <Image style={roomStyle.chatAvartar} source={{ uri: user?.photoURL || undefined }} />

                        {item.type === "image" ? (
                            <Image style={roomStyle.uploadedImage} source={{ uri: item.content }} />
                        ) : (
                            <ChatBubble
                                bubbleStyle={[roomStyle.chatBubble, colors.chatBubbleBackgroundColor]}
                                textStyle={[colors.blackTextColor, roomStyle.chatBubbleText]}
                                text={item.content}
                            />
                        )}

                        <Text style={roomStyle.chatMessageDate}>{formatedMessageDate}</Text>
                    </View>
                </View>
            )}
        </>
    )
};

export const MemoizedMessage = memo(Message, (prevProps, nextProps) => {
    return prevProps.item === nextProps.item
        && prevProps.user === nextProps.user;
});

export default Message;