import React from "react";
import PropTypes from "prop-types";

const SearchFailure = ({ className }) => (
  <div className={className}>
    Failed to fetch Matching Contacts!
  </div>
);

SearchFailure.propTypes = {
  className: PropTypes.string,
};

export default SearchFailure;