import { Alert } from "react-native";

export const dialogueWithOK = (title: string, message: string, onOkPress?: Function) => {
    Alert.alert(title, message, [
        { text: 'OK', onPress: onOkPress ? () => onOkPress() : () => null },
    ]);
}