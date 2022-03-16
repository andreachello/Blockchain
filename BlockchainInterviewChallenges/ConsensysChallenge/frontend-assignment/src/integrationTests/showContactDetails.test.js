import React from "react";
import {
  anyContactDetails,
  contactDetails,
  httpNotFoundResponse,
  httpOkResponse,
  matchingContact,
  mockHttpApi,
  renderApp,
} from "../testUtils";

describe("show Contact Details", () => {

  let httpApi;
  let tree;

  const searchForMatchingContacts = async ({ httpApiWillReturn }) => {
    httpApi.getFirst5MatchingContacts.mockImplementation(
      () => httpOkResponse(httpApiWillReturn),
    );
    tree.searchPhraseInput().changeValueTo("any phrase");
    await tree.waitForHttp();
  };

  const selectFirstMatchingContact = async ({ andWaitForHttp = true } = {}) => {
    tree.matchingContacts().items().at(0).simulate("click");
    if (andWaitForHttp) {
      await tree.waitForHttp();
    }
  };

  beforeEach(() => {
    jest.useFakeTimers();
    httpApi = mockHttpApi();
    tree = renderApp({ httpApi });
  });

  describe("first fetch", () => {

    it("ask HTTP API for Contact Details if Matching Contact was selected", async () => {
      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact({ id: "123" }),
        ],
      });

      await selectFirstMatchingContact();

      expect(httpApi.getContact).toHaveBeenCalled();
    });

    it("show placeholder if Matching Contact was not selected yet", async () => {
      httpApi.getContact.mockImplementation(() => httpOkResponse(
        anyContactDetails(),
      ));
      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact(),
        ],
      });

      // do not select any Matching Contact

      expect(tree.contactDetails().placeholder()).toExist();
    });

    it("show placeholder if Contact Details for selected Matching Contact are not fetched yet", async () => {
      httpApi.getContact.mockImplementation(() => httpOkResponse(
        anyContactDetails(),
      ));
      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact(),
        ],
      });

      await selectFirstMatchingContact({
        andWaitForHttp: false,
      });

      expect(tree.contactDetails().placeholder()).toExist();
    });

    it("don't show placeholder when Contact Details fetched", async () => {
      httpApi.getContact.mockImplementation(() => httpOkResponse(
        anyContactDetails(),
      ));

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact(),
        ],
      });
      await selectFirstMatchingContact();

      expect(tree.contactDetails().placeholder()).not.toExist();
    });

    it("show structure for fetched Contact Details", async () => {
      httpApi.getContact.mockImplementation(() => httpOkResponse(
        anyContactDetails(),
      ));

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact(),
        ],
      });
      await selectFirstMatchingContact();

      expect(tree.contactDetails().name()).toExist();
      expect(tree.contactDetails().phone()).toExist();
      expect(tree.contactDetails().address()).toExist();
    });

  });

  describe("second fetch", () => {

    it("don't show placeholder when User search for new Matching Contacts", async () => {
      httpApi.getContact.mockImplementation(({ contactId }) => httpOkResponse(
        contactId === "111"
          ? contactDetails({ id: "111", name: "Geralt" })
          : contactDetails({ id: "222", name: "Yennefer" }),
      ));

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact({ id: "111" }),
        ],
      });
      await selectFirstMatchingContact();

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact({ id: "222" }),
        ],
      });

      expect(tree.contactDetails().placeholder()).not.toExist();
    });

    it("show previously fetched Contact Details when User search for new Matching Contacts", async () => {
      httpApi.getContact.mockImplementation(({ contactId }) => httpOkResponse(
        contactId === "111"
          ? contactDetails({ id: "111", name: "Geralt" })
          : contactDetails({ id: "222", name: "Yennefer" }),
      ));

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact({ id: "111" }),
        ],
      });
      await selectFirstMatchingContact();

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact({ id: "222" }),
        ],
      });

      expect(tree.contactDetails().name().find("span").at(1))
        .toHaveText("Geralt");
    });

    it("do not fetch Contact Details again, if new selected are same as those currently shown", async () => {
      httpApi.getContact.mockImplementation(() => httpOkResponse(
        contactDetails({ id: "111", name: "Geralt" }),
      ));

      await searchForMatchingContacts({
        httpApiWillReturn: [ matchingContact({ id: "111" }) ],
      });
      await selectFirstMatchingContact();

      expect(httpApi.getContact).toHaveBeenCalledTimes(1);

      await searchForMatchingContacts({
        httpApiWillReturn: [ matchingContact({ id: "111" }) ],
      });
      await selectFirstMatchingContact();

      expect(httpApi.getContact).toHaveBeenCalledTimes(1);
    });

    it("don't show previous Contact Details if next fetch just started", async () => {
      httpApi.getContact.mockImplementation(({ contactId }) => httpOkResponse(
        contactId === "111"
          ? contactDetails({ id: "111", name: "Geralt" })
          : contactDetails({ id: "222", name: "Yennefer" }),
      ));

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact({ id: "111" }),
        ],
      });

      await selectFirstMatchingContact();

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact({ id: "222" }),
        ],
      });

      await selectFirstMatchingContact({
        andWaitForHttp: false,
      });

      expect(tree.contactDetails().name()).not.toExist();
      expect(tree.contactDetails().phone()).not.toExist();
      expect(tree.contactDetails().address()).not.toExist();
    });

  });

  describe("failed fetch", () => {

    it("show info about failed fetch of Contact Details", async () => {
      httpApi.getContact.mockImplementation(
        () => httpNotFoundResponse(),
      );

      await searchForMatchingContacts({
        httpApiWillReturn: [ matchingContact() ],
      });
      await selectFirstMatchingContact();

      expect(tree.contactDetails().fetchFailure()).toExist();
    });

  });

  describe("caching", () => {

    it("ask HTTP API for Contact Details for the 1st time", async () => {
      httpApi.getContact.mockImplementation(({ contactId }) => httpOkResponse(
        contactId === "111"
          ? contactDetails({ id: "111", name: "Geralt" })
          : contactDetails({ id: "222", name: "Yennefer" }),
      ));

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact({ id: "111" }),
        ],
      });
      await selectFirstMatchingContact();

      expect(httpApi.getContact).toHaveBeenCalledTimes(1);
      expect(tree.contactDetails().name().find("span").at(1)).toHaveText("Geralt");

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact({ id: "222" }),
        ],
      });
      await selectFirstMatchingContact();

      expect(httpApi.getContact).toHaveBeenCalledTimes(2);
      expect(tree.contactDetails().name().find("span").at(1)).toHaveText("Yennefer");
    });

    it("don't ask HTTP API for Contact Details for the 2nd time", async () => {
      httpApi.getContact.mockImplementation(({ contactId }) => httpOkResponse(
        contactId === "111"
          ? contactDetails({ id: "111", name: "Geralt" })
          : contactDetails({ id: "222", name: "Yennefer" }),
      ));

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact({ id: "111" }),
        ],
      });
      await selectFirstMatchingContact();

      expect(httpApi.getContact).toHaveBeenCalledTimes(1);

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact({ id: "222" }),
        ],
      });
      await selectFirstMatchingContact();

      expect(httpApi.getContact).toHaveBeenCalledTimes(2);

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact({ id: "111" }),
        ],
      });
      await selectFirstMatchingContact();

      expect(httpApi.getContact).toHaveBeenCalledTimes(2);
      expect(tree.contactDetails().name().find("span").at(1)).toHaveText("Geralt");

      await searchForMatchingContacts({
        httpApiWillReturn: [
          matchingContact({ id: "222" }),
        ],
      });
      await selectFirstMatchingContact();

      expect(httpApi.getContact).toHaveBeenCalledTimes(2);
      expect(tree.contactDetails().name().find("span").at(1)).toHaveText("Yennefer");
    });

  });

});
