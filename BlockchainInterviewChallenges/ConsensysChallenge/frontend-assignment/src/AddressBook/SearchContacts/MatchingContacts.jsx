import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./MatchingContacts.css";

const MatchingContacts = (
  {
    data,
    highlightedIndex,
    downshiftGetMenuProps,
    downshiftGetItemProps,
  },
) => {
  // TODO something is missing here

  return (
    <ul
      {...downshiftGetMenuProps()}
      className="MatchingContacts"
    >
      {data.map((item, index) => (
        <li
          {...downshiftGetItemProps({
            key: item.id,
            item: item,
            // TODO something is wrong here
            className: classNames(
              "MatchingContacts_item",
              {
                "MatchingContacts_item_highlighted": highlightedIndex === index, // if the highlightedIndex matches the index, then highlighted class name is given
              }),
          })}
        >
          {item.value}
        </li>
      ))}
    </ul>
  );
};

MatchingContacts.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  highlightedIndex: PropTypes.number,
  downshiftGetMenuProps: PropTypes.func.isRequired,
  downshiftGetItemProps: PropTypes.func.isRequired,
};

export default MatchingContacts;