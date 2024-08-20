import React from "react";
import Icon from 'react-native-vector-icons/Entypo';
import { Text, TouchableOpacity, View } from "react-native";
import { roomStyle } from "../../../assets/styles/roomStyle";
import Comment from "../../../assets/img/comment.svg";
import { RoomListType } from "../../../redux/reducers/roomListSlice";
import { ItemSection } from "./item-section";

interface ListType extends RoomListType {
    handleClick: () => void
}

export const ListItem = (props: ListType): React.JSX.Element => {
    return (
        <View style={roomStyle.room}>
            <TouchableOpacity onPress={props.handleClick}>
                <ItemSection>
                    <View style={roomStyle.roomItems}>
                        <View style={roomStyle.floatRightWrapper}>
                            <Text>{new Date(props.date_last_message).toLocaleDateString("dk", { month: "short", year: "numeric", day: "numeric" })}</Text>
                        </View>
                        <Text style={roomStyle.title}>{props.chat_name}</Text>
                        <Text style={roomStyle.description}>{props.description}</Text>
                        <View style={[roomStyle.floatRightWrapper, roomStyle.commentWrapper]}>
                            <Comment height={18} width={20} />
                            <Text>{props.total_messages}</Text>
                        </View>
                    </View>
                    <Icon name="chevron-thin-right" size={40} color={"black"} />
                </ItemSection>
            </TouchableOpacity>
        </View>
    )
}