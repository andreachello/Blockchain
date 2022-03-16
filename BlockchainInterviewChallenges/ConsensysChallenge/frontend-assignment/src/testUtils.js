import React from "react";
import { mount } from "enzyme";
import shortid from "shortid";

import { setupStore } from "./store/store";
import App from "./App";
import SearchContacts from "./AddressBook/SearchContacts";
import ContactDetails from "./AddressBook/ContactDetails";
import SearchFailure from "./AddressBook/SearchContacts/SearchFailure";
import FetchFailure from "./AddressBook/ContactDetails/FetchFailure";
import Placeholder from "./AddressBook/ContactDetails/Placeholder";
import {
  _200_OK,
  _404_NOT_FOUND,
  _500_INTERNAL_SERVER_ERROR,
} from "./httpApi/httpStatus";

export const reduceWith = (reducer) => {

  const chainedCheck = (nextState) => (checker) => {
    checker(nextState);
    return {
      reduce: chainedReduce(nextState),
    };
  };

  const chainedReduce = (previousState) => (action) => {
    const nextState = reducer(previousState, action);
    return {
      check: chainedCheck(nextState),
    };
  };

  return chainedReduce(undefined);
};

const flushAllPromises = () =>
  new Promise(resolve => setImmediate(resolve));

export const httpOkResponse = (data) => Promise.resolve({
  status: _200_OK,
  data: data,
});

export const httpNotFoundResponse = () => Promise.reject({
  status: _404_NOT_FOUND,
});

export const httpInternalServerErrorResponse = () => Promise.reject({
  status: _500_INTERNAL_SERVER_ERROR,
});

export const mockHttpApi = () => ({
  getFirst5MatchingContacts: jest.fn().mockImplementation(
    ({ namePart }) => httpOkResponse([ anyMatchingContact() ]),
  ),
  getContact: jest.fn().mockImplementation(
    ({ contactId }) => httpOkResponse(contactDetails({ id: contactId })),
  ),
});

export const renderApp = ({ httpApi } = {}) => {

  const reduxStore = setupStore({
    httpApi: httpApi || mockHttpApi(),
  });

  const tree = mount(
    <App reduxStore={reduxStore} />,
  );

  tree.searchPhraseInput = () => {
    const element = tree.find(SearchContacts).find("input");
    element.changeValueTo = (newValue) =>
      element.simulate("change", { target: { value: newValue } });
    return element;
  };

  tree.searchFailure = () =>
    tree.find(SearchContacts).find(SearchFailure);

  tree.matchingContacts = () => {
    const element = tree.find(SearchContacts).find("ul");
    element.items = () => element.find("li");
    return element;
  };

  tree.contactDetails = () => {
    const element = tree.find(ContactDetails);
    element.fetchFailure = () => element.find(FetchFailure);
    element.placeholder = () => element.find(Placeholder);
    element.name = () => element.find(".ContactDetails_name");
    element.phone = () => element.find(".ContactDetails_phone");
    element.address = () => element.find(".ContactDetails_address");
    return element;
  };

  const waitForHttpRequest = async () => {
    // Timer matters in case of "get 5 matching contacts" request only.
    // For another requests we can run timers too, without any harm.
    jest.runAllTimers();
  };

  const waitForHttpResponse = async () => {
    // We need to allow HTTP request/response Promise to resolve, to see effects.
    // Moreover tree rendered with enzyme has to be updated too.
    await flushAllPromises();
    tree.update();
  };

  tree.waitForHttp = async ({ waitForResponse = true } = {}) => {
    await waitForHttpRequest();
    if (waitForResponse) {
      await waitForHttpResponse();
    }
  };

  return tree;
};

export const anyMatchingContact = () => matchingContact();

export const matchingContact = ({ id, name } = {}) => ({
  id: id || shortid.generate(),
  name: name || "Any Name",
});

export const anyContactDetails = () => contactDetails();

export const contactDetails = ({ id, name, phone, addressLines } = {}) => ({
  id: id || shortid.generate(),
  name: name || "Any Name",
  phone: phone || "+1 234 567 890",
  addressLines: addressLines || [
    "any 1st address line",
    "any 2nd address line",
  ],
});
