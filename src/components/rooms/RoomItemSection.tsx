import React from "react";
import { View } from "react-native";
import { roomStyle } from "../../styles/roomStyle";

const RoomItemSection = ({ children }): React.JSX.Element => {
    return (
        <View style={roomStyle.RoomItemSection}>
            {children}
        </View>
    )
}

export default RoomItemSection;