import { Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native"

type ChatButtonType = {
    style: ViewStyle[];
    textStyle: TextStyle[];
    onPress: () => void;
    disabled?: boolean;
    buttonText: string;
}

export const ChatButton = ({ style, textStyle, onPress, disabled = false, buttonText }: ChatButtonType) => {
    return (
        <TouchableOpacity style={style} onPress={onPress} disabled={disabled}>
            <Text style={textStyle}>{buttonText}</Text>
        </TouchableOpacity>
    )
}