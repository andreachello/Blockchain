import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import AddressBook from "./AddressBook";

import "./App.css";

const App = ({ reduxStore }) => (
  <ReduxProvider store={reduxStore}>
    <main className="App">
      <AddressBook />
    </main>
  </ReduxProvider>
);

export default App;