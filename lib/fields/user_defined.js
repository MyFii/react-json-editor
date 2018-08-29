'use strict';

var React = require('react');

var normalizer = require('./utils/normalizer');
var parser = require('./utils/parser');


class UserDefinedField extends React.Component {
  static displayName = 'UserDefinedField';

  normalize = (text) => {
    var n = normalizer[this.props.type];
    return n ? n(text) : text;
  };

  parse = (text) => {
    var p = parser[this.props.type];
    return p ? p(text) : text;
  };

  handleChange = (value) => {
    var text = this.normalize(value);
    this.props.update(this.props.path, text, this.parse(text));
  };

  handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  render() {
    return React.createElement(this.props.component, {
      name      : this.props.label,
      schema    : this.props.schema,
      value     : this.props.value || '',
      onKeyPress: this.handleKeyPress,
      onChange  : this.handleChange
    });
  }
}

module.exports = UserDefinedField;
