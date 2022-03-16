import { combineReducers } from "redux";

import { reducer as addressBookReducer } from "./AddressBook";

export default combineReducers({
  addressBook: addressBookReducer,
});
