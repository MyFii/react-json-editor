'use strict';

var React = require('react');
var $ = React.DOM;


class CheckBox extends React.Component {
  static displayName = 'CheckBox';

  handleChange = (event) => {
    var val = event.target.checked ? true : null;
    this.props.update(this.props.path, val, val);
  };

  render() {
    return $.input({
      name: this.props.label,
      type: "checkbox",
      checked: this.props.value || false,
      onChange: this.handleChange,
      disabled: this.props.disabled });
  }
}

module.exports = CheckBox;

