import React from "react";
import { View } from "react-native";
import { roomStyle } from "../../../assets/styles/roomStyle";

export const ItemSection = ({ children }): React.JSX.Element => {
    return (
        <View style={roomStyle.RoomItemSection}>
            {children}
        </View>
    )
}