import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import ChatRoomsScreen from "../screens/chat-rooms/chat-rooms.screen";
import ChatScreen from "../screens/chat/chat.screen";
import { colors } from "../assets/styles/colors";
import { signOut } from "../services/AuthService";

type AppStackParamList = {
    ChatRooms: undefined;
    Chat: { chat_id: string, chat_name: string };
    AppDrawer: undefined;
}

type AppDrawerParamList = {
    Logout: undefined
}

const Stack = createNativeStackNavigator<AppStackParamList>();
const Drawer = createDrawerNavigator<AppDrawerParamList>();

export type ChatRoomsNavigationProps = NativeStackScreenProps<AppStackParamList, "ChatRooms">;
export type ChatNavigationProps = NativeStackScreenProps<AppStackParamList, "Chat">;


const AppDrawer = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerStyle: colors.orangeBackgroundColor,
                headerTintColor: colors.whiteTextColor.color,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTitleAlign: "center"
            }}
            drawerContent={(props) => {
                //Overrides the content of the drawer. DrawerItemList renders all of the existing screens and DrawerItem adds a new custom item
                return (
                    <DrawerContentScrollView {...props}>
                        <DrawerItemList {...props} />
                        <DrawerItem label={"Logout"} onPress={signOut} />
                    </DrawerContentScrollView>
                )
            }}
        >
            <Stack.Screen name="ChatRooms" component={ChatRoomsScreen} options={{ title: "Chat Rooms" }} />
        </Drawer.Navigator>
    )
}


export const AppNavigator = () => {
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
            }}>
            <Stack.Screen name="AppDrawer" component={AppDrawer} options={{ headerShown: false }} />

            <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.chat_name })} />
        </Stack.Navigator>
    )
}