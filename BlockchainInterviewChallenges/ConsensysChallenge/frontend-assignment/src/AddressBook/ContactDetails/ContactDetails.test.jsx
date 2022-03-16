import React from "react";
import { mount } from "enzyme";
import configureStore from "redux-mock-store";
import { Provider as ReduxProvider } from "react-redux";

import ContactDetails from "./ContactDetails";
import FetchFailure from "./FetchFailure";
import Placeholder from "./Placeholder";

const mockStore = configureStore();

const anyContact = (overrides) => ({
  name: "Any Contact Name",
  phone: "+987 654 321",
  addressLines: [
    "address – line 1",
    "address – line 2",
  ],
  ...overrides,
});

const renderContactDetails = (reduxStateOverrides) => {
  const store = mockStore({
    addressBook: {
      contactDetails: {
        fetchedContact: null,
        fetchFailure: false,
        ...reduxStateOverrides,
      },
    },
  });
  return mount(
    <ReduxProvider store={store}>
      <ContactDetails />
    </ReduxProvider>,
  );
};

describe("<ContactDetails>", () => {

  it("render <Placeholder> if there is no contact fetched", async () => {
    // given
    const tree = renderContactDetails({
      fetchedContact: null,
    });

    // then
    expect(tree.find(Placeholder)).toExist();
  });

  it("render <FetchFailure> if fetching failed", async () => {
    // given
    const tree = renderContactDetails({
      fetchedContact: null,
      fetchFailure: true,
    });

    // then
    expect(tree.find(FetchFailure)).toExist();
  });

  it("render <FetchFailure> if fetching failed and there is previously fetched Contact available", async () => {
    // given
    const tree = renderContactDetails({
      fetchedContact: anyContact(),
      fetchFailure: true,
    });

    // then
    expect(tree.find(FetchFailure)).toExist();
  });

  it("render name of fetched Contact Details", async () => {
    // given
    const tree = renderContactDetails({
      fetchedContact: anyContact({
        name: "John",
      }),
    });

    // then
    expect(tree.find(".ContactDetails_name")).toExist();
    expect(tree.find(".ContactDetails_name").find("span").at(0))
      .toHaveText("Name");
    expect(tree.find(".ContactDetails_name").find("span").at(1))
      .toHaveText("John");
  });

  it("render 1st address line of fetched Contact Details", async () => {
    // given
    const tree = renderContactDetails({
      fetchedContact: anyContact({
        addressLines: [
          "line 1",
          "line 2",
          "line 3",
        ],
      }),
      fetchFailure: false,
    });

    // then
    expect(tree.find(".ContactDetails_address")).toExist();
    expect(tree.find(".ContactDetails_address").find("span").at(0))
      .toHaveText("Address");
    expect(tree.find(".ContactDetails_address").find("span").at(1))
      .toHaveText("line 1");
  });

});
