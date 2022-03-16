import React from "react";
import PropTypes from "prop-types";
import { connect as connectWithRedux } from "react-redux";
import Downshift from "downshift";

import { selectMatchingContact, updateSearchPhrase } from "../actions";
import PhraseInput from "./PhraseInput";
import MatchingContacts from "./MatchingContacts";
import SearchFailure from "./SearchFailure";

import "./SearchContacts.css";

class SearchContacts extends React.Component {

  static propTypes = {
    phrase: PropTypes.string.isRequired,
    onPhraseChange: PropTypes.func.isRequired,
    matchingContacts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
    onMatchingContactSelect: PropTypes.func.isRequired,
    hasFailedToSearch: PropTypes.bool.isRequired,
  };

  render () {
    const {
      phrase,
      onPhraseChange,
      matchingContacts,
      onMatchingContactSelect,
      hasFailedToSearch,
    } = this.props;

    return (
      <section className="SearchContacts">
        <Downshift
          itemToString={item => (item ? item.value : "")}
          onChange={item => onMatchingContactSelect(item)}
        >
          {({
              isOpen,
              highlightedIndex,
              getInputProps,
              getMenuProps,
              getItemProps,
            }) => (
            <div>
              <PhraseInput
                phrase={phrase}
                onPhraseChange={onPhraseChange}
                downshiftGetInputProps={getInputProps}
              />
              {
                isOpen && (
                  <MatchingContacts
                    data={matchingContacts}
                    highlightedIndex={highlightedIndex}
                    downshiftGetMenuProps={getMenuProps}
                    downshiftGetItemProps={getItemProps}
                  />
                )}
            </div>
          )}
        </Downshift>
        {hasFailedToSearch && (
          <SearchFailure className="SearchContacts_failure" />
        )}
      </section>
    );
  }

}

const mapReduxStateToProps = state => ({
  phrase: state.addressBook.search.phrase,
  matchingContacts: state.addressBook.search.matchingContacts,
  hasFailedToSearch: state.addressBook.search.searchFailure,
});

const mapReduxDispatchToProps = dispatch => ({
  onPhraseChange:
    (newPhrase) => dispatch(updateSearchPhrase(newPhrase)),
  // TODO something is wrong here
  onMatchingContactSelect:
    (selectedMatchingContact) => dispatch(updateSearchPhrase(selectedMatchingContact.value)),
});

export default connectWithRedux(
  mapReduxStateToProps,
  mapReduxDispatchToProps,
)(SearchContacts);