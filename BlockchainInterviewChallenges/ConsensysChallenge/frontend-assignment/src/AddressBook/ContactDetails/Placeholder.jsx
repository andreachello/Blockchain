import React from "react";
import PropTypes from "prop-types";

const Placeholder = ({ className }) => (
  <div className={className}>
    Contact Details will appear here…
  </div>
);

Placeholder.propTypes = {
  className: PropTypes.string,
};

export default Placeholder;