import React from "react";
import { Text, View } from "react-native";
import { colors } from "../../styles/colors";
import { globalStyle } from "../../styles/global";

type AuthError = {
    message: string
}

const AuthError = ({ message }: AuthError): React.JSX.Element => {
    return (
        <View>
            <Text style={[colors.errorTextColor, globalStyle.errorText]}>{message}</Text>
        </View>
    )
}

export default AuthError;