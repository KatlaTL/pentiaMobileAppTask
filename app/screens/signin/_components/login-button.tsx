import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { signInStyle as styles } from "../../../assets/styles/signInStyle";
import { globalStyle } from "../../../assets/styles/global";
import { Text, TouchableOpacity, View } from "react-native";

type LoginButtonType = {
    onPress: () => void,
    backgroundColorHex: string,
    iconColorHex: string,
    iconName: string,
    buttonText: string,
    textColorHex: string
}

export const LoginButton = ({ onPress, backgroundColorHex, iconColorHex, iconName, buttonText, textColorHex }: LoginButtonType): React.JSX.Element => {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: backgroundColorHex }]} onPress={async () => await onPress()}>
            <Icon name={iconName} size={30} style={[globalStyle.flex1, { marginLeft: 15 }]} color={iconColorHex} />
            <Text style={[styles.buttonText, { flex: 4, color: textColorHex }]}>{buttonText}</Text>
        </TouchableOpacity>
    )
}
