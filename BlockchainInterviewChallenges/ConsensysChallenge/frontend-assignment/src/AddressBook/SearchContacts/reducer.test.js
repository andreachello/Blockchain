import reducer from "./reducer";
import {
  selectMatchingContact,
  updateSearchPhraseFailure,
  updateSearchPhraseStart,
  updateSearchPhraseSuccess,
} from "./actions";
import { reduceWith } from "../../testUtils";

describe("Search reducer", () => {

  it("Search Phrase", () => {
    reduceWith(reducer)(
      updateSearchPhraseStart({ newPhrase: "oh" }),
    ).check(state =>
      expect(state.phrase).toEqual("oh"),
    ).reduce(
      updateSearchPhraseSuccess({ matchingContacts: [ "any matching contact" ] }),
    ).check(state =>
      expect(state.phrase).toEqual("oh"),
    ).reduce(
      selectMatchingContact({ selectedMatchingContact: { id: "John" } }), // it's access as id not value in reducer
    ).check(state =>
      expect(state.phrase).toEqual("John"),
    );
  });

  it("Matching Contacts", () => {
    reduceWith(reducer)(
      updateSearchPhraseStart({ newPhrase: "oh" }),
    ).check(state =>
      expect(state.matchingContacts).toEqual([]),
    ).reduce(
      updateSearchPhraseSuccess({ matchingContacts: [ { value: "John" } ] }),
    ).check(state =>
      expect(state.matchingContacts).toEqual([ { value: "John" } ]),
    ).reduce(
      selectMatchingContact({ selectedMatchingContact: { value: "John" } }),
    ).check(state =>
      expect(state.matchingContacts).toEqual([]),
    );
  });

  it("search failure", () => {
    reduceWith(reducer)(
      updateSearchPhraseStart({ newPhrase: "any phrase" }),
    ).check(state =>
      expect(state.searchFailure).toEqual(false),
    ).reduce(
      updateSearchPhraseFailure(),
    ).check(state =>
      expect(state.searchFailure).toEqual(true),
    );
  });

});