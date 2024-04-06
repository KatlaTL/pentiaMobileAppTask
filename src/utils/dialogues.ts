import { Alert } from "react-native";

export const dialogueWithOK = (title: string, message: string, onPressOK?: Function) => {
    Alert.alert(title, message, [
        { text: "OK", onPress: onPressOK ? () => onPressOK() : () => null },
    ]);
}

export const dialogueWithYesAndNo = (title: string, message: string, onPressYes: Function, onPressNo?: Function) => {
    Alert.alert(title, message, [
        { text: "Yes", onPress: () => onPressYes() },
        { text: "No", onPress: onPressNo ? () => onPressNo() : () => null }
    ]);
}