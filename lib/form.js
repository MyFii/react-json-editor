'use strict';

var React = require('react');
var $ = require('react-dom');

var ou = require('./objectUtils');

var fields = require('./fields');
var normalise = require('./normalise');
var validator = require('./validate');


module.exports = class extends React.Component {
  static displayName = 'Form';

  constructor(props, context) {
    super(props, context);
    var values = props.values;
    var errors = this.validate(props.schema, values, context(props));

    this.state = { values: values,
             output: values,
             errors: errors };
  }

  componentWillReceiveProps(props) {
    var values = props.values || this.state.values;
    var output = props.values || this.state.output;
    this.setState({
      values: values,
      output: output,
      errors: this.validate(props.schema, output, context(props))
    });
  }

  setValue = (path, raw, parsed) => {
    var schema = this.props.schema;
    var ctx    = context(this.props);
    var values = normalise(ou.setIn(this.state.values, path, raw),
                           schema, ctx);
    var output = normalise(ou.setIn(this.state.output, path, parsed),
                           schema, ctx);
    var errors = this.validate(schema, output, ctx);

    if (this.props.submitOnChange) {
      this.props.onSubmit(output, null, errors);
    }

    this.setState({
      values: values,
      output: output,
      errors: errors
    });
  };

  getValue = (path) => {
    return ou.getIn(this.state.values, path);
  };

  getErrors = (path) => {
    return this.state.errors[makeKey(path)];
  };

  validate = (schema, values, context) => {
    var validate = this.props.validate || validator;
    return hashedErrors(validate(schema, values, context));
  };

  preventSubmit = (event) => {
    event.preventDefault();
  };

  handleSubmit = (event) => {  
    this.props.onSubmit(this.state.output,
                        event.target.value,
                        this.state.errors);
  };

  handleKeyPress = (event) => {
    if (event.keyCode === 13 && this.props.enterKeySubmits) {
      this.props.onSubmit(this.state.output, this.props.enterKeySubmits);
    }
  };

  renderButtons = () => {
    var submit = this.handleSubmit;

    if (typeof this.props.buttons === 'function') {
      return this.props.buttons(submit);;
    }
    else {
      var buttons = (this.props.buttons || ['Cancel', 'Submit'])
        .map(function(value) {
          return $.input({ type   : 'submit',
                           key    : value,
                           value  : value,
                           onClick: submit });
        });
      return $.p(null, buttons);
    }
  };

  render() {
    var renderedFields = fields.make(fields, {
      schema        : this.props.schema,
      context       : context(this.props),
      fieldWrapper  : this.props.fieldWrapper,
      sectionWrapper: this.props.sectionWrapper,
      handlers      : this.props.handlers,
      hints         : this.props.hints,
      path          : [],
      update        : this.setValue,
      getValue      : this.getValue,
      getErrors     : this.getErrors
    });

    return $.form({ onSubmit  : this.preventSubmit,
                    onKeyPress: this.handleKeyPress,
                    className : this.props.className
                  },
                  this.props.extraButtons ? this.renderButtons() : $.span(),
                  renderedFields,
                  this.renderButtons());
  }
};

function hashedErrors(errors) {
  var result = {};
  var i, entry;
  for (i = 0; i < errors.length; ++i) {
    entry = errors[i];
    result[makeKey(entry.path)] = entry.errors;
  }
  return result;
}

function makeKey(path) {
  return path.join('_');
}

function context(props) {
  return props.context || props.schema;
}
