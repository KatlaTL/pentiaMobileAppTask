import { memo } from "react";
import { colors } from "../../styles/colors";
import { roomStyle } from "../../styles/roomStyle";
import { Text, View } from "react-native";
import { UserType } from "../../redux/reducers/userSlice";
import { MessageType } from "../../redux/reducers/messageSlice";

type Message = {
    item: MessageType,
    user: UserType | null
}

const Message = ({ item, user }: Message): React.JSX.Element => {
    const style = item.uid === user?.uid ? [roomStyle.chatSelfBubble, colors.chatBubbleSelfBackgroundColor] : [roomStyle.chatBubble, colors.chatBubbleBackgroundColor];

    return (
        <View>
            {item.uid != user?.uid && <Text style={roomStyle.chatUser}>{item.user_name}</Text>}
            <View style={style}>
                <Text style={[colors.blackTextColor, roomStyle.chatBubbleText]}>{item.content + " " + item.message_id}</Text>
            </View>
        </View>
    )
};

export const MemoizedMessage = memo(Message, (prevProps, nextProps) => {
    return prevProps.item === nextProps.item
        && prevProps.user === nextProps.user;
});

export default Message;