import { StyleSheet } from "react-native";

export const roomStyle = StyleSheet.create({
    roomList: {
        flexDirection: "column",
        height: 250,
        margin: 10,
    },
    room: {
        flex: 1,
        borderBottomColor: "Black",
        borderBottomWidth: 2,
        height: 100,
        justifyContent: "space-evenly",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "black"
    },
    description: {
        fontSize: 16,
        fontWeight: "500",   
    },
    floatRightWrapper: {
        alignSelf: "flex-end",
        alignItems: "flex-end",
    }
});