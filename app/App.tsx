import 'react-native-gesture-handler';
import React from "react";
import store from "./redux/store/store";
import { Provider } from "react-redux";
import { RootNavigator } from './navigators/root.navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoadingProvider } from './contexts/loading.context';

const App = (): React.JSX.Element => {
    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <LoadingProvider>
                    <RootNavigator />
                </LoadingProvider>
            </Provider>
        </SafeAreaProvider>
    )
}

export default App;