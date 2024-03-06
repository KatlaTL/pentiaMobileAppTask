import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { roomStyle } from "../../styles/roomStyle";
import Comment from "../../assets/comment.svg";
import { RoomListType } from "../../redux/reducers/roomListSlice";

interface ListType extends RoomListType {
    handleClick: () => void
}

const RoomListItem = (props: ListType): React.JSX.Element => {
    return (
        <View style={roomStyle.room}>
            <TouchableOpacity onPress={props.handleClick}>
                <View style={roomStyle.floatRightWrapper}>
                    <Text>{new Date(props.date_last_message).toLocaleDateString("dk", { month: "short", year: "numeric", day: "numeric" })}</Text>
                </View>
                <Text style={roomStyle.title}>{props.room_name}</Text>
                <Text style={roomStyle.description}>{props.description}</Text>
                <View style={[roomStyle.floatRightWrapper, roomStyle.commentWrapper]}>
                    <Comment height={18} width={20} />
                    <Text>{props.total_messages}</Text>
                </View>
            </TouchableOpacity>
        </View >
    )
}

export default RoomListItem;