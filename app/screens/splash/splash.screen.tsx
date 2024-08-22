import { ActivityIndicator, View } from "react-native";
import { globalStyle } from "../../assets/styles/global";

/**
 * Displays Splash Screen
 */
const SplashScreen = (): React.JSX.Element => {
    return (
        <View style={globalStyle.activityIndicator}>
            <ActivityIndicator size={100} color="#0000ff" />
        </View>
    );
}

export default SplashScreen;