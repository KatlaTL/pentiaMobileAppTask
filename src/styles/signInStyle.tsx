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
        height: "12%",
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
        marginTop: 15
    },
    buttonText: {
        fontSize: 22
    },
    registerWrapper: {
        width: "80%",
        flexDirection: "row",
        justifyContent: "space-evenly",
    }
})