import React from "react";

import FakeHttpApi, { SEARCH_REQUEST_MIN_INTERVAL_IN_MILLIS } from "../httpApi/fakeHttpApi";
import {
  anyMatchingContact,
  httpInternalServerErrorResponse,
  httpOkResponse,
  matchingContact,
  mockHttpApi,
  renderApp,
} from "../testUtils";

describe("search for matching Contacts", () => {

  describe("search Contact by search phrase", () => {

    let httpApi;
    let tree;

    beforeEach(() => {
      jest.useFakeTimers();
      httpApi = mockHttpApi();
      tree = renderApp({ httpApi });
    });

    it("render text typed into search phrase input", async () => {
      tree.searchPhraseInput().changeValueTo("a");

      expect(tree.searchPhraseInput()).toHaveValue("a");
    });

    it("ask HTTP API for Matching Contacts after delay of minimal allowed interval", async () => {
      tree.searchPhraseInput().changeValueTo("any");
      jest.runTimersToTime(SEARCH_REQUEST_MIN_INTERVAL_IN_MILLIS - 1); // not using this delay in testUtils.js then don't know why are we adding it here in test cases

      expect(httpApi.getFirst5MatchingContacts).not.toHaveBeenCalled();

      jest.runTimersToTime(1);

      expect(httpApi.getFirst5MatchingContacts).toHaveBeenCalled();
    });

    it("ask HTTP API for Matching Contacts again after another minimal delay", async () => {
      tree = renderApp({ httpApi });
      tree.searchPhraseInput().changeValueTo("first phrase");
      jest.runTimersToTime(SEARCH_REQUEST_MIN_INTERVAL_IN_MILLIS);

      expect(httpApi.getFirst5MatchingContacts).toHaveBeenCalledTimes(1);

      tree.searchPhraseInput().changeValueTo("second phrase");
      jest.runTimersToTime(SEARCH_REQUEST_MIN_INTERVAL_IN_MILLIS - 1);

      expect(httpApi.getFirst5MatchingContacts).toHaveBeenCalledTimes(1);

      jest.runTimersToTime(1);

      expect(httpApi.getFirst5MatchingContacts).toHaveBeenCalledTimes(2);
    });

  });

  describe("Matching Contacts", () => {

    let httpApi;
    let tree;

    beforeEach(() => {
      jest.useFakeTimers();
      httpApi = mockHttpApi();
      tree = renderApp({ httpApi });
    });

    it("don't show Matching Contacts if nothing was searched", async () => {
      httpApi.getFirst5MatchingContacts.mockImplementation(() => httpOkResponse([
        anyMatchingContact(),
      ]));

      expect(tree.matchingContacts()).not.toExist();
    });

    it("show found Matching Contacts", async () => {
      httpApi.getFirst5MatchingContacts.mockImplementation(() => httpOkResponse([
        matchingContact({ id: "111", name: "Geralt" }),
        matchingContact({ id: "222", name: "Yennefer" }),
        matchingContact({ id: "333", name: "Triss" }),
      ]));

      tree.searchPhraseInput().changeValueTo("any");
      await tree.waitForHttp();

      expect(tree.matchingContacts()).toExist();
      expect(tree.matchingContacts().items().length).toBeGreaterThan(0);
    });

  });

  describe("failure while searching for Matching Contacts", () => {

    let httpApi;
    let tree;

    beforeEach(() => {
      jest.useFakeTimers();
      httpApi = mockHttpApi();
      tree = renderApp({ httpApi });
    });

    it("show info about failed search for Matching Contacts", async () => {
      httpApi.getFirst5MatchingContacts.mockImplementation(
        () => httpInternalServerErrorResponse(),
      );

      tree.searchPhraseInput().changeValueTo("any");
      await tree.waitForHttp();

      expect(tree.searchFailure()).toExist(); 
    });

    it("don't show info about failed search if next Matching Contacts search started", async () => {
      httpApi.getFirst5MatchingContacts.mockImplementation(
        () => httpInternalServerErrorResponse(),
      );
      tree.searchPhraseInput().changeValueTo("any1");
      await tree.waitForHttp();

      httpApi.getFirst5MatchingContacts.mockImplementation(
        () => httpOkResponse([ anyMatchingContact() ]),
      );
      tree.searchPhraseInput().changeValueTo("any2");
      await tree.waitForHttp({ waitForResponse: false });

      expect(tree.searchFailure()).not.toExist();
    });

  });

  describe("select Matching Contact", () => {

    let httpApi;
    let tree;

    beforeEach(() => {
      jest.useFakeTimers();
      httpApi = mockHttpApi();
      tree = renderApp({ httpApi });
    });

    it("fill search input with name of selected Matching Contact", async () => {
      httpApi.getFirst5MatchingContacts.mockImplementation(() => httpOkResponse([
        matchingContact({ id: "111", name: "Geralt" }),
        matchingContact({ id: "222", name: "Yennefer" }),
        matchingContact({ id: "333", name: "Triss" }),
      ]));

      tree.searchPhraseInput().changeValueTo("any phrase");
      await tree.waitForHttp();

      expect(tree.matchingContacts().items().at(1)).toHaveText("Yennefer");
      tree.matchingContacts().items().at(1).simulate("click");

      expect(tree.searchPhraseInput()).toHaveValue("Yennefer");
    });

    it("don't show previous Matching Contacts on new just started search", async () => {
      httpApi.getFirst5MatchingContacts.mockImplementation(() => httpOkResponse([
        matchingContact({ id: "111", name: "Geralt" }),
        matchingContact({ id: "222", name: "Yennefer" }),
        matchingContact({ id: "333", name: "Triss" }),
      ]));

      tree.searchPhraseInput().changeValueTo("first phrase");
      await tree.waitForHttp();

      tree.matchingContacts().items().at(0).simulate("click");

      tree.searchPhraseInput().changeValueTo("second phrase");
      await tree.waitForHttp({ waitForResponse: false });

      expect(tree.matchingContacts().items().find('li')).not.toExist();
    });

    it("don't crash if no Matching Contact is selected for the first time", async () => {
      httpApi.getFirst5MatchingContacts.mockImplementation(() => httpOkResponse([
        anyMatchingContact(),
      ]));

      tree.searchPhraseInput().changeValueTo("any");
      await tree.waitForHttp();

      tree.searchPhraseInput().simulate("keyDown", { key: "Escape" });

      // then do not fail
    });

  });

});
