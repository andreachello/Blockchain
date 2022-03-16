export const FETCH_CONTACT_DETAILS__START = "FETCH_CONTACT_DETAILS__START";
export const FETCH_CONTACT_DETAILS__SUCCESS = "FETCH_CONTACT_DETAILS__SUCCESS";
export const FETCH_CONTACT_DETAILS__FAILURE = "FETCH_CONTACT_DETAILS__FAILURE";

export const fetchContactDetailsStart = () => ({
  type: FETCH_CONTACT_DETAILS__START,
});
export const fetchContactDetailsSuccess = ({ contactDetails }) => ({
  type: FETCH_CONTACT_DETAILS__SUCCESS,
  payload: {
    contactDetails,
  },
});
export const fetchContactDetailsFailure = () => ({
  type: FETCH_CONTACT_DETAILS__FAILURE,
});