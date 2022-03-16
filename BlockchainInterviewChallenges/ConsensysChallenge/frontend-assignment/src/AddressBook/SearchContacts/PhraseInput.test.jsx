import React from "react";
import { mount } from "enzyme";

import PhraseInput from "./PhraseInput";

const renderPhraseInput = (propsOverrides) =>
  mount(
    <PhraseInput
      phrase=""
      onPhraseChange={() => {}}
      downshiftGetInputProps={(props) => props}
      {...propsOverrides}
    />,
  );

describe("<PhraseInput>", () => {

  it("render provided phrase", async () => {
    // given
    const tree = renderPhraseInput({
      phrase: "fancy phrase, lol",
    });

    // then
    expect(tree.find("input")).toHaveValue("fancy phrase, lol");
  });

  it("pass typed phrase to callback", async () => {
    // given
    const onPhraseChangeMock = jest.fn();
    const tree = renderPhraseInput({
      onPhraseChange: onPhraseChangeMock,
    });

    // when
    tree.simulate("change", { target: { value: "what a phrase!" } });

    // then
    expect(onPhraseChangeMock).toHaveBeenCalledWith("what a phrase!");
  });

});
