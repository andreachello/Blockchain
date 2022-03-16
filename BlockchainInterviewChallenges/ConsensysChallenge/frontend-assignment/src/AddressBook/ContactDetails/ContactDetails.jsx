import React from "react";
import PropTypes from "prop-types";
import { connect as connectWithRedux } from "react-redux";

import FetchFailure from "./FetchFailure";
import Placeholder from "./Placeholder";

import "./ContactDetails.css";

const ContactDetails = ({ data, hasFailedToFetch }) => {
  const { name, phone, addressLines } = (data || {});
  const wrapped = (node) => (
    <section className="ContactDetails">
      {node}
    </section>
  );

  if (hasFailedToFetch) {
    return wrapped(
      <FetchFailure className="ContactDetails_failure" />,
    );
  }

  if (!data) {
    return wrapped(
      <Placeholder className="ContactDetails_placeholder" />,
    );
  }

  return wrapped(
    <div className="ContactDetails_data">

      <div className="ContactDetails_data_item ContactDetails_name">
        <span>Name</span>
        <span>{name}</span>
      </div>

      <div className="ContactDetails_data_item ContactDetails_phone">
        <span>Phone</span>
        <span>{phone}</span>
      </div>

      {/* TODO something is wrong here */}
      <div className="ContactDetails_data_item ContactDetails_address">
        <span>Address</span>
        <span>{addressLines[0]}</span>
      </div>

    </div>,
  );
};

ContactDetails.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    addressLines: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  hasFailedToFetch: PropTypes.bool.isRequired,
};

const mapReduxStateToProps = state => ({
  data: state.addressBook.contactDetails.fetchedContact,
  hasFailedToFetch: state.addressBook.contactDetails.fetchFailure,
});

export default connectWithRedux(
  mapReduxStateToProps,
)(ContactDetails);