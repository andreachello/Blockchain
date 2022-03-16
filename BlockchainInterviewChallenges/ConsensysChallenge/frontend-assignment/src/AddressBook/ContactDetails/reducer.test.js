import reducer from "./reducer";
import {
  fetchContactDetailsFailure,
  fetchContactDetailsStart,
  fetchContactDetailsSuccess,
} from "./actions";
import { reduceWith } from "../../testUtils";

describe("Contact Details reducer", () => {

  it("fetched Contact Details", () => {
    reduceWith(reducer)(
      fetchContactDetailsStart(),
    ).check(state =>
      expect(state.fetchedContact).toEqual(null),
    ).reduce(
      fetchContactDetailsSuccess({ contactDetails: "any contact details" }),
    ).check(state =>
      expect(state.fetchedContact).toEqual("any contact details"),
    );
  });

  it("fetch failure", () => {
    reduceWith(reducer)(
      fetchContactDetailsStart(),
    ).check(state =>
      expect(state.fetchFailure).toEqual(false),
    ).reduce(
      fetchContactDetailsFailure(),
    ).check(state =>
      expect(state.fetchFailure).toEqual(true),
    );
  });

});