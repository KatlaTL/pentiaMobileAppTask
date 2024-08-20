import { Alert } from "react-native";

export const dialogueWithOK = (title: string, message: string, onPressOK?: Function) => {
    Alert.alert(title, message, [
        { text: "OK", onPress: onPressOK ? () => onPressOK() : () => null },
    ]);
}
type dialogueWithTwoOptionsType = {
    title: string,
    message: string,
    optionOne: {
        onPress: Function,
        text: string
    },
    optionTwo: {
        onPress: Function,
        text: string
    }
}

export const dialogueWithTwoOptions = ({ title, message, optionOne, optionTwo }: dialogueWithTwoOptionsType) => {
    Alert.alert(title, message, [
        { text: optionOne.text, onPress: () => optionOne.onPress() },
        { text: optionTwo.text, onPress: () => optionTwo.onPress() },
        { text: "Cancel", onPress: () => null }
    ]);
}