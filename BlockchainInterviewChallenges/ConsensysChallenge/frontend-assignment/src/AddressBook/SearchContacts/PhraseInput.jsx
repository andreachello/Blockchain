import React from "react";
import PropTypes from "prop-types";

import "./PhraseInput.css";

class PhraseInput extends React.Component {

  static propTypes = {
    phrase: PropTypes.string.isRequired,
    onPhraseChange: PropTypes.func.isRequired,
    downshiftGetInputProps: PropTypes.func.isRequired,
  };

  componentDidMount () {
    this.inputRef.focus();
  }

  render () {
    const {
      phrase,
      onPhraseChange,
      downshiftGetInputProps,
    } = this.props;

    return (
      <input
        {...downshiftGetInputProps({
          // TODO something is wrong here
          className: "PhraseInput",
          ref: inputRef => this.inputRef = inputRef,
          placeholder: "To show contact's details, type its name…",
          value: phrase,
          onChange: event => onPhraseChange(event.target.value), // target.value instead of string
        })}
      />
    );
  }

}

export default PhraseInput;