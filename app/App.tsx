import 'react-native-gesture-handler';
import React from "react";
import store from "./redux/store/store";
import { Provider } from "react-redux";
import { RootNavigator } from './navigators/root.navigator';

const App = (): React.JSX.Element => {
    return (
        <Provider store={store}>
            <RootNavigator />
        </Provider>
    )
}

export default App;