import React from "react";

import {
  anyMatchingContact,
  httpOkResponse,
  mockHttpApi,
  renderApp,
} from "./testUtils";

describe("<App>", () => {

  it("render crucial components", async () => {
    // given
    jest.useFakeTimers();
    const httpApi = mockHttpApi();
    const tree = renderApp({ httpApi });

    // then
    expect(tree.searchPhraseInput()).toExist();
    expect(tree.contactDetails()).toExist();

    // and when
    httpApi.getFirst5MatchingContacts.mockImplementation(
      () => httpOkResponse(
        [
          anyMatchingContact(),
        ],
      ),
    );
    tree.searchPhraseInput().changeValueTo("any name part");
    await tree.waitForHttp();

    // then
    expect(tree.matchingContacts()).toExist();
  });

});
