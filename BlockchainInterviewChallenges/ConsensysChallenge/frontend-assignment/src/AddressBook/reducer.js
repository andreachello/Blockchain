import { combineReducers } from "redux";

import { reducer as searchReducer } from "./SearchContacts";
import { reducer as contactDetailsReducer } from "./ContactDetails";

// TODO something is wrong here
export default combineReducers({
  search: searchReducer,
  contactDetails: contactDetailsReducer,
});
