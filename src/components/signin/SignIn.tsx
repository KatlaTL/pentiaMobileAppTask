import React from "react";
import { View } from "react-native";
import { signInStyle as styles } from "../../styles/signInStyle";
import { colors } from "../../styles/colors";
import { onFacebookSignIn, onGoogleSignIn } from "../../services/AuthService";
import LoginCTA from "./LoginCTA";

const SignIn = (): React.JSX.Element => {

    return (
        <View style={styles.signInWrapper}>
            <LoginCTA 
                backgroundColorHex={colors.facebookBackgroundColor.backgroundColor} 
                buttonText="Sign In with Facebook"
                textColorHex={colors.whiteTextColor.color}
                iconColorHex="#fff"
                iconName="facebook"
                onPress={onFacebookSignIn} 
            />

            <LoginCTA 
                backgroundColorHex={colors.whiteBackgroundColor.backgroundColor} 
                buttonText="Sign In with Google" 
                textColorHex={colors.blackTextColor.color}
                iconColorHex="#EA4335"
                iconName="google"
                onPress={onGoogleSignIn} 
            />
        </View>
    )
}

export default SignIn;