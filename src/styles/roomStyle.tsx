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
        flexDirection: "row",
    },
    commentWrapper: {
        width: 40,
        justifyContent: "space-evenly"
    },
    chatHeading: {
        fontSize: 30,
        fontWeight: "500",
        alignSelf: "center",
        marginBottom: 10,
        marginTop: 5
    },
    chatFlatList: {
        flexDirection: 'column-reverse',
    },
    chatBubble: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 5,
        marginLeft: "5%",
        maxWidth: '50%',
        alignSelf: 'flex-start',
    },
    chatSelfBubble: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 5,
        marginRight: "5%",
        maxWidth: '50%',
        alignSelf: 'flex-end',
    },
    chatBubbleText: {
        fontSize: 16,
        fontWeight: "400"
    },
    chatUser: {
        fontSize: 12,
        marginLeft: "5%",
        marginTop: 5
    },
    chatInputWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 5
    },
    chatButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginRight: "5%",
        borderRadius: 5,
    },
    chatButtonText: {
        fontSize: 22
    },
    chatInputField: {
        flex: 4,
        borderColor: "black",
        borderWidth: 1,
        fontSize: 20,
        fontWeight: "bold",
        paddingLeft: 10,
        marginLeft: "5%",
        borderRadius: 5,
    }
});