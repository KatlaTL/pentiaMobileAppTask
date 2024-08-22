import { Alert } from "react-native";

/**
 * Create an alert with a single OK button
 */
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

/**
 * Create an alert with two options buttons and a cancel button
 * @param optionOne - Object with an onPress function and a text
 * @param optionTwo - Object with an onPress function and a text
*/
export const dialogueWithTwoOptions = ({ title, message, optionOne, optionTwo }: dialogueWithTwoOptionsType) => {
    Alert.alert(title, message, [
        { text: optionOne.text, onPress: () => optionOne.onPress() },
        { text: optionTwo.text, onPress: () => optionTwo.onPress() },
        { text: "Cancel", onPress: () => null }
    ]);
}