import 'react-native-gesture-handler';
import React from "react";
import store from "./redux/store/store";
import { Provider } from "react-redux";
import Main from "./components/Main";

const App = (): React.JSX.Element => {
    return (
        <Provider store={store}>
            <Main />
        </Provider>
    )
}

export default App;