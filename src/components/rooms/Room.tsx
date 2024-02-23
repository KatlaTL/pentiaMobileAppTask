import React from "react";
import { Text, View } from "react-native";
import { RoomType } from "./RoomsList";
import { roomStyle } from "../../styles/roomStyle";

const Room = (props: RoomType): React.JSX.Element => {
    return (
        <View style={roomStyle.room}>
            <View style={roomStyle.floatRightWrapper}>
                <Text>{props.date_last_message.toLocaleDateString("dk", { month: "short", year: "numeric", day: "numeric" })}</Text>
            </View>
            <Text style={roomStyle.title}>{props.room_name}</Text>
            <Text style={roomStyle.description}>{props.description}</Text>
            <View style={roomStyle.floatRightWrapper}>
                <Text>Amout of posts: {props.total_messages}</Text>
            </View>
        </View>
    )
}

export default Room;