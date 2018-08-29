'use strict';

var React = require('react');
var $ = React.DOM;

var normalizer = require('./utils/normalizer');
var parser = require('./utils/parser');


class InputField extends React.Component {
  static displayName = 'InputField';

  normalize = (text) => {
    return normalizer[this.props.type](text);
  };

  parse = (text) => {
    return parser[this.props.type](text);
  };

  handleChange = (event) => {
    var text = this.normalize(event.target.value);
    this.props.update(this.props.path, text, this.parse(text));
  };

  handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  render() {
    return $.input({
      type      : "text",
      disabled  : this.props.disabled,
      hidden    : this.props.hidden,
      name      : this.props.label,
      value     : this.props.value || '',
      onKeyPress: this.handleKeyPress,
      onChange  : this.handleChange });
  }
}

module.exports = InputField;
