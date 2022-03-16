import {
  SELECT_MATCHING_CONTACT,
  UPDATE_SEARCH_PHRASE__FAILURE,
  UPDATE_SEARCH_PHRASE__START,
  UPDATE_SEARCH_PHRASE__SUCCESS,
} from "./actions";

const initialState = {
  phrase: "",
  matchingContacts: [],
  searchFailure: false,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {

    case UPDATE_SEARCH_PHRASE__START:
      return {
        ...state,
        phrase: payload.newPhrase,
        searchFailure: false,
        matchingContacts: [],
      };

    case UPDATE_SEARCH_PHRASE__SUCCESS:
      return {
        ...state,
        matchingContacts: payload.matchingContacts,
      };

    // [SOLVED] TODO something is wrong here
    case UPDATE_SEARCH_PHRASE__FAILURE:
      return {
        ...state,
        searchFailure: true, // it failed
        matchingContacts: [],
      };

    // TODO something is wrong here
    case SELECT_MATCHING_CONTACT:
      return {
        ...state,
        phrase: payload.selectedMatchingContact.id,
        matchingContacts: [],
      };

    default:
      return state;

  }
};

export default reducer;