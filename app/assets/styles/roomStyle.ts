import { StyleSheet, Platform } from "react-native";

export const roomStyle = StyleSheet.create({
    roomList: {
        flexDirection: "column",
        height: "auto",
        margin: 10,
    },
    room: {
        flex: 1,
        borderBottomColor: "Black",
        borderBottomWidth: 2,
        height: "auto",
        justifyContent: "space-evenly"
    },
    roomItems: {
        width: "92%",
    },
    RoomItemSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
        marginTop: 5
    },
    title: {
        fontSize: 20,
        fontWeight: Platform.OS === "ios" ? "600" : "700",
        color: "black"
    },
    description: {
        fontSize: 16,
        fontWeight: Platform.OS === "ios" ? "300" : "500",
        opacity: Platform.OS === "ios" ? .8 : 1,
    },
    floatRightWrapper: {
        alignSelf: "flex-end",
        flexDirection: "row"
    },
    commentWrapper: {
        width: 40,
        marginTop: 10,
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
    uploadedImage: {
        height: 225, 
        width: 225, 
        borderWidth: 1, 
        borderColor: "black",
        borderRadius: 5,
        marginTop: 5,
        marginLeft: "2%",
        alignSelf: 'flex-start',
    },
    uploadedImageSelf: {
        height: 225, 
        width: 225, 
        borderWidth: 1, 
        borderColor: "black",
        borderRadius: 5,
        marginTop: 5,
        marginRight: "2%",
        alignSelf: 'flex-end',
    },
    spaceBetweenChatBubbles: {
        marginTop: "5%"
    },
    chatBubbleContainer: {
        flexDirection: "row",
        marginLeft: "5%",
        marginBottom: 10,
    },
    chatBubbleContainerSelf: {
        flexDirection: "row",
        marginRight: "5%",
        marginBottom: 10,
        alignSelf: 'flex-end'
    },
    chatAvartar: {
        height: 30,
        width: 30,
        alignSelf: "flex-end",
        marginBottom: "1%",
        borderRadius: 20,
    },
    chatBubble: {
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginLeft: "2%",
        maxWidth: '60%',
        alignSelf: 'flex-start',
    },
    chatSelfBubble: {
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginRight: "2%",
        maxWidth: '60%',
        alignSelf: 'flex-end',
    },
    chatBubbleText: {
        fontSize: 16,
        fontWeight: "400"
    },
    chatUser: {
        fontSize: 12,
        marginLeft: "5%"
    },
    chatUserSelf: {
        fontSize: 12,
        marginRight: "5%",
        alignSelf: "flex-end",
        opacity: Platform.OS === "ios" ? .5 : 1,
    },
    chatMessageDate: {
        fontSize: 12,
        marginLeft: "5%",
        alignSelf: "center"
    },
    chatMessageSelfDate: {
        fontSize: 12,
        marginRight: "5%",
        alignSelf: "center",
        opacity: Platform.OS === "ios" ? .5 : 1,

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
        marginRight: "3%",
        borderRadius: 5,
    },
    chatButtonText: {
        fontSize: 22,
        fontWeight: "500"
    },
    chatInputField: {
        flex: 3,
        borderColor: "black",
        borderWidth: 1,
        fontSize: 20,
        fontWeight: "bold",
        paddingLeft: 10,
        borderRadius: 5,
    },
    uploadPhoto: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        marginLeft: "3%"
    },
    uploadPhotoText: {
        fontSize: 16,
        fontWeight: "500"
    }
});