import React from "react";
import { View } from "react-native";
import { signInStyle as styles } from "../../assets/styles/signInStyle";
import { colors } from "../../assets/styles/colors";
import { onFacebookSignIn, onGoogleSignIn } from "../../services/AuthService";
import { LoginButton } from "./_components/login-button";

const SignInScreen = (): React.JSX.Element => {

    return (
        <View style={styles.signInWrapper}>
            <LoginButton 
                backgroundColorHex={colors.facebookBackgroundColor.backgroundColor} 
                buttonText="Sign In with Facebook"
                textColorHex={colors.whiteTextColor.color}
                iconColorHex="#fff"
                iconName="facebook"
                onPress={onFacebookSignIn} 
            />

            <LoginButton 
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

export default SignInScreen;