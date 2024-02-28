import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RoomListType } from "./RoomsList";
import { roomStyle } from "../../styles/roomStyle";
import Comment from "../../assets/comment.svg";
import { useAppDispatch } from "../../redux/store/store";
import { setRoomId } from '../../redux/reducers/roomSlice';

const RoomListItem = (props: RoomListType): React.JSX.Element => {
    const appDispatch = useAppDispatch();

    const handleClick = () => {
        appDispatch(setRoomId({
            room_id: props.room_id
        }))
    }

    return (
        <View style={roomStyle.room}>
            <TouchableOpacity onPress={handleClick}>
                <View style={roomStyle.floatRightWrapper}>
                    <Text>{props.date_last_message.toLocaleDateString("dk", { month: "short", year: "numeric", day: "numeric" })}</Text>
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