import React from "react";
import store from "./src/redux/store/store";
import { Provider } from "react-redux";
import Main from "./src/components/Main";

const App = (): React.JSX.Element => {
    return (
        <Provider store={store}>
            <Main />
        </Provider>
    )
}

export default App;