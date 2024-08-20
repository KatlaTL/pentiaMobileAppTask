import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../assets/styles/colors";
import SignInScreen from "../screens/signin/signin.screen";

type AuthStackParamList = {
    SignIn: undefined;
}

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: colors.orangeBackgroundColor,
                headerTintColor: colors.whiteTextColor.color,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTitleAlign: "center",
                animation: "slide_from_right"
            }}
        >
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: "Sign In" }} />
        </Stack.Navigator>
    )
}