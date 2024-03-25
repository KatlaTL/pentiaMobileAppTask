import { StyleSheet } from "react-native";

export const signInStyle = StyleSheet.create({
    signInWrapper: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        alignSelf: "center",
        width: "80%"
    },
    inputWrapper: {
        width: "100%",
        height: "auto",
        minHeight: 100
    },
    inputField: {
        borderColor: "black",
        borderWidth: 2,
        width: "100%",
        fontSize: 26,
        fontWeight: "bold",
        paddingLeft: 10,
    },
    label: {
        fontSize: 22,
        color: "black",
        alignSelf: "baseline"
    },
    button: {
        width: "100%",
        height: "6%",
        minHeight: 65,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        flexDirection: "row",
        elevation: 5,
        shadowColor: '#52006A',
        borderColor: "#a3a3a3",
        borderWidth: 1
    },
    buttonText: {
        fontSize: 22
    },
    registerWrapper: {
        width: "85%",
        flexDirection: "row",
        justifyContent: "space-evenly",
    }
})