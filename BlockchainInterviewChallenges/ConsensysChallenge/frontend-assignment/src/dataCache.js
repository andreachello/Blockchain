export default class DataCache {

  data = {};

  store = ({ key, value }) => {
    this.data[ key ] = value;
  };

  load = ({ key }) => this.data[ key ];

}
