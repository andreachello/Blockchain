import React from "react";

import SearchContacts from "./SearchContacts";
import ContactDetails from "./ContactDetails";

class AddressBook extends React.Component {

  render () {
    return (
      <React.Fragment>
        <h1>Address Book</h1>
        <SearchContacts />
        <ContactDetails />
      </React.Fragment>
    );
  }
}

export default AddressBook;