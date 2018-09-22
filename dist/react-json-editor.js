(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["react-json-editor"] = factory(require("react"));
	else
		root["react-json-editor"] = factory(root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	The MIT License (MIT)

	Copyright (c) 2015 The Australian National University

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	*/

	'use strict';

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	React.createClass = __webpack_require__(3)
	var $ = __webpack_require__(11);

	var ou = __webpack_require__(12);

	var fields = __webpack_require__(13);
	var normalise = __webpack_require__(26);
	var validator = __webpack_require__(27);


	module.exports = React.createClass({
	  displayName: 'Form',

	  getInitialState: function() {
	    var values = this.props.values;
	    var errors = this.validate(this.props.schema, values, context(this.props));
	    return { values: values,
	             output: values,
	             errors: errors };
	  },
	  componentWillReceiveProps: function(props) {
	    var values = props.values || this.state.values;
	    var output = props.values || this.state.output;
	    this.setState({
	      values: values,
	      output: output,
	      errors: this.validate(props.schema, output, context(props))
	    });
	  },
	  setValue: function(path, raw, parsed) {
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
	  },
	  getValue: function(path) {
	    return ou.getIn(this.state.values, path);
	  },
	  getErrors: function(path) {
	    return this.state.errors[makeKey(path)];
	  },
	  validate: function(schema, values, context) {
	    var validate = this.props.validate || validator;
	    return hashedErrors(validate(schema, values, context));
	  },
	  preventSubmit: function(event) {
	    event.preventDefault();
	  },
	  handleSubmit: function(event) {  
	    this.props.onSubmit(this.state.output,
	                        event.target.value,
	                        this.state.errors);
	  },
	  handleKeyPress: function(event) {
	    if (event.keyCode === 13 && this.props.enterKeySubmits) {
	      this.props.onSubmit(this.state.output, this.props.enterKeySubmits);
	    }
	  },
	  renderButtons: function() {
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
	  },
	  render: function() {
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
	});

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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	var React = __webpack_require__(2);
	var factory = __webpack_require__(4);

	if (typeof React === 'undefined') {
	  throw Error(
	    'create-react-class could not find the React object. If you are using script tags, ' +
	      'make sure that React is being loaded before create-react-class.'
	  );
	}

	// Hack to grab NoopUpdateQueue from isomorphic React
	var ReactNoopUpdateQueue = new React.Component().updater;

	module.exports = factory(
	  React.Component,
	  React.isValidElement,
	  ReactNoopUpdateQueue
	);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */

	'use strict';

	var _assign = __webpack_require__(6);

	var emptyObject = __webpack_require__(7);
	var _invariant = __webpack_require__(8);

	if (process.env.NODE_ENV !== 'production') {
	  var warning = __webpack_require__(9);
	}

	var MIXINS_KEY = 'mixins';

	// Helper function to allow the creation of anonymous functions which do not
	// have .name set to the name of the variable being assigned to.
	function identity(fn) {
	  return fn;
	}

	var ReactPropTypeLocationNames;
	if (process.env.NODE_ENV !== 'production') {
	  ReactPropTypeLocationNames = {
	    prop: 'prop',
	    context: 'context',
	    childContext: 'child context'
	  };
	} else {
	  ReactPropTypeLocationNames = {};
	}

	function factory(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
	  /**
	   * Policies that describe methods in `ReactClassInterface`.
	   */

	  var injectedMixins = [];

	  /**
	   * Composite components are higher-level components that compose other composite
	   * or host components.
	   *
	   * To create a new type of `ReactClass`, pass a specification of
	   * your new class to `React.createClass`. The only requirement of your class
	   * specification is that you implement a `render` method.
	   *
	   *   var MyComponent = React.createClass({
	   *     render: function() {
	   *       return <div>Hello World</div>;
	   *     }
	   *   });
	   *
	   * The class specification supports a specific protocol of methods that have
	   * special meaning (e.g. `render`). See `ReactClassInterface` for
	   * more the comprehensive protocol. Any other properties and methods in the
	   * class specification will be available on the prototype.
	   *
	   * @interface ReactClassInterface
	   * @internal
	   */
	  var ReactClassInterface = {
	    /**
	     * An array of Mixin objects to include when defining your component.
	     *
	     * @type {array}
	     * @optional
	     */
	    mixins: 'DEFINE_MANY',

	    /**
	     * An object containing properties and methods that should be defined on
	     * the component's constructor instead of its prototype (static methods).
	     *
	     * @type {object}
	     * @optional
	     */
	    statics: 'DEFINE_MANY',

	    /**
	     * Definition of prop types for this component.
	     *
	     * @type {object}
	     * @optional
	     */
	    propTypes: 'DEFINE_MANY',

	    /**
	     * Definition of context types for this component.
	     *
	     * @type {object}
	     * @optional
	     */
	    contextTypes: 'DEFINE_MANY',

	    /**
	     * Definition of context types this component sets for its children.
	     *
	     * @type {object}
	     * @optional
	     */
	    childContextTypes: 'DEFINE_MANY',

	    // ==== Definition methods ====

	    /**
	     * Invoked when the component is mounted. Values in the mapping will be set on
	     * `this.props` if that prop is not specified (i.e. using an `in` check).
	     *
	     * This method is invoked before `getInitialState` and therefore cannot rely
	     * on `this.state` or use `this.setState`.
	     *
	     * @return {object}
	     * @optional
	     */
	    getDefaultProps: 'DEFINE_MANY_MERGED',

	    /**
	     * Invoked once before the component is mounted. The return value will be used
	     * as the initial value of `this.state`.
	     *
	     *   getInitialState: function() {
	     *     return {
	     *       isOn: false,
	     *       fooBaz: new BazFoo()
	     *     }
	     *   }
	     *
	     * @return {object}
	     * @optional
	     */
	    getInitialState: 'DEFINE_MANY_MERGED',

	    /**
	     * @return {object}
	     * @optional
	     */
	    getChildContext: 'DEFINE_MANY_MERGED',

	    /**
	     * Uses props from `this.props` and state from `this.state` to render the
	     * structure of the component.
	     *
	     * No guarantees are made about when or how often this method is invoked, so
	     * it must not have side effects.
	     *
	     *   render: function() {
	     *     var name = this.props.name;
	     *     return <div>Hello, {name}!</div>;
	     *   }
	     *
	     * @return {ReactComponent}
	     * @required
	     */
	    render: 'DEFINE_ONCE',

	    // ==== Delegate methods ====

	    /**
	     * Invoked when the component is initially created and about to be mounted.
	     * This may have side effects, but any external subscriptions or data created
	     * by this method must be cleaned up in `componentWillUnmount`.
	     *
	     * @optional
	     */
	    componentWillMount: 'DEFINE_MANY',

	    /**
	     * Invoked when the component has been mounted and has a DOM representation.
	     * However, there is no guarantee that the DOM node is in the document.
	     *
	     * Use this as an opportunity to operate on the DOM when the component has
	     * been mounted (initialized and rendered) for the first time.
	     *
	     * @param {DOMElement} rootNode DOM element representing the component.
	     * @optional
	     */
	    componentDidMount: 'DEFINE_MANY',

	    /**
	     * Invoked before the component receives new props.
	     *
	     * Use this as an opportunity to react to a prop transition by updating the
	     * state using `this.setState`. Current props are accessed via `this.props`.
	     *
	     *   componentWillReceiveProps: function(nextProps, nextContext) {
	     *     this.setState({
	     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
	     *     });
	     *   }
	     *
	     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
	     * transition may cause a state change, but the opposite is not true. If you
	     * need it, you are probably looking for `componentWillUpdate`.
	     *
	     * @param {object} nextProps
	     * @optional
	     */
	    componentWillReceiveProps: 'DEFINE_MANY',

	    /**
	     * Invoked while deciding if the component should be updated as a result of
	     * receiving new props, state and/or context.
	     *
	     * Use this as an opportunity to `return false` when you're certain that the
	     * transition to the new props/state/context will not require a component
	     * update.
	     *
	     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
	     *     return !equal(nextProps, this.props) ||
	     *       !equal(nextState, this.state) ||
	     *       !equal(nextContext, this.context);
	     *   }
	     *
	     * @param {object} nextProps
	     * @param {?object} nextState
	     * @param {?object} nextContext
	     * @return {boolean} True if the component should update.
	     * @optional
	     */
	    shouldComponentUpdate: 'DEFINE_ONCE',

	    /**
	     * Invoked when the component is about to update due to a transition from
	     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
	     * and `nextContext`.
	     *
	     * Use this as an opportunity to perform preparation before an update occurs.
	     *
	     * NOTE: You **cannot** use `this.setState()` in this method.
	     *
	     * @param {object} nextProps
	     * @param {?object} nextState
	     * @param {?object} nextContext
	     * @param {ReactReconcileTransaction} transaction
	     * @optional
	     */
	    componentWillUpdate: 'DEFINE_MANY',

	    /**
	     * Invoked when the component's DOM representation has been updated.
	     *
	     * Use this as an opportunity to operate on the DOM when the component has
	     * been updated.
	     *
	     * @param {object} prevProps
	     * @param {?object} prevState
	     * @param {?object} prevContext
	     * @param {DOMElement} rootNode DOM element representing the component.
	     * @optional
	     */
	    componentDidUpdate: 'DEFINE_MANY',

	    /**
	     * Invoked when the component is about to be removed from its parent and have
	     * its DOM representation destroyed.
	     *
	     * Use this as an opportunity to deallocate any external resources.
	     *
	     * NOTE: There is no `componentDidUnmount` since your component will have been
	     * destroyed by that point.
	     *
	     * @optional
	     */
	    componentWillUnmount: 'DEFINE_MANY',

	    /**
	     * Replacement for (deprecated) `componentWillMount`.
	     *
	     * @optional
	     */
	    UNSAFE_componentWillMount: 'DEFINE_MANY',

	    /**
	     * Replacement for (deprecated) `componentWillReceiveProps`.
	     *
	     * @optional
	     */
	    UNSAFE_componentWillReceiveProps: 'DEFINE_MANY',

	    /**
	     * Replacement for (deprecated) `componentWillUpdate`.
	     *
	     * @optional
	     */
	    UNSAFE_componentWillUpdate: 'DEFINE_MANY',

	    // ==== Advanced methods ====

	    /**
	     * Updates the component's currently mounted DOM representation.
	     *
	     * By default, this implements React's rendering and reconciliation algorithm.
	     * Sophisticated clients may wish to override this.
	     *
	     * @param {ReactReconcileTransaction} transaction
	     * @internal
	     * @overridable
	     */
	    updateComponent: 'OVERRIDE_BASE'
	  };

	  /**
	   * Similar to ReactClassInterface but for static methods.
	   */
	  var ReactClassStaticInterface = {
	    /**
	     * This method is invoked after a component is instantiated and when it
	     * receives new props. Return an object to update state in response to
	     * prop changes. Return null to indicate no change to state.
	     *
	     * If an object is returned, its keys will be merged into the existing state.
	     *
	     * @return {object || null}
	     * @optional
	     */
	    getDerivedStateFromProps: 'DEFINE_MANY_MERGED'
	  };

	  /**
	   * Mapping from class specification keys to special processing functions.
	   *
	   * Although these are declared like instance properties in the specification
	   * when defining classes using `React.createClass`, they are actually static
	   * and are accessible on the constructor instead of the prototype. Despite
	   * being static, they must be defined outside of the "statics" key under
	   * which all other static methods are defined.
	   */
	  var RESERVED_SPEC_KEYS = {
	    displayName: function(Constructor, displayName) {
	      Constructor.displayName = displayName;
	    },
	    mixins: function(Constructor, mixins) {
	      if (mixins) {
	        for (var i = 0; i < mixins.length; i++) {
	          mixSpecIntoComponent(Constructor, mixins[i]);
	        }
	      }
	    },
	    childContextTypes: function(Constructor, childContextTypes) {
	      if (process.env.NODE_ENV !== 'production') {
	        validateTypeDef(Constructor, childContextTypes, 'childContext');
	      }
	      Constructor.childContextTypes = _assign(
	        {},
	        Constructor.childContextTypes,
	        childContextTypes
	      );
	    },
	    contextTypes: function(Constructor, contextTypes) {
	      if (process.env.NODE_ENV !== 'production') {
	        validateTypeDef(Constructor, contextTypes, 'context');
	      }
	      Constructor.contextTypes = _assign(
	        {},
	        Constructor.contextTypes,
	        contextTypes
	      );
	    },
	    /**
	     * Special case getDefaultProps which should move into statics but requires
	     * automatic merging.
	     */
	    getDefaultProps: function(Constructor, getDefaultProps) {
	      if (Constructor.getDefaultProps) {
	        Constructor.getDefaultProps = createMergedResultFunction(
	          Constructor.getDefaultProps,
	          getDefaultProps
	        );
	      } else {
	        Constructor.getDefaultProps = getDefaultProps;
	      }
	    },
	    propTypes: function(Constructor, propTypes) {
	      if (process.env.NODE_ENV !== 'production') {
	        validateTypeDef(Constructor, propTypes, 'prop');
	      }
	      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
	    },
	    statics: function(Constructor, statics) {
	      mixStaticSpecIntoComponent(Constructor, statics);
	    },
	    autobind: function() {}
	  };

	  function validateTypeDef(Constructor, typeDef, location) {
	    for (var propName in typeDef) {
	      if (typeDef.hasOwnProperty(propName)) {
	        // use a warning instead of an _invariant so components
	        // don't show up in prod but only in __DEV__
	        if (process.env.NODE_ENV !== 'production') {
	          warning(
	            typeof typeDef[propName] === 'function',
	            '%s: %s type `%s` is invalid; it must be a function, usually from ' +
	              'React.PropTypes.',
	            Constructor.displayName || 'ReactClass',
	            ReactPropTypeLocationNames[location],
	            propName
	          );
	        }
	      }
	    }
	  }

	  function validateMethodOverride(isAlreadyDefined, name) {
	    var specPolicy = ReactClassInterface.hasOwnProperty(name)
	      ? ReactClassInterface[name]
	      : null;

	    // Disallow overriding of base class methods unless explicitly allowed.
	    if (ReactClassMixin.hasOwnProperty(name)) {
	      _invariant(
	        specPolicy === 'OVERRIDE_BASE',
	        'ReactClassInterface: You are attempting to override ' +
	          '`%s` from your class specification. Ensure that your method names ' +
	          'do not overlap with React methods.',
	        name
	      );
	    }

	    // Disallow defining methods more than once unless explicitly allowed.
	    if (isAlreadyDefined) {
	      _invariant(
	        specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED',
	        'ReactClassInterface: You are attempting to define ' +
	          '`%s` on your component more than once. This conflict may be due ' +
	          'to a mixin.',
	        name
	      );
	    }
	  }

	  /**
	   * Mixin helper which handles policy validation and reserved
	   * specification keys when building React classes.
	   */
	  function mixSpecIntoComponent(Constructor, spec) {
	    if (!spec) {
	      if (process.env.NODE_ENV !== 'production') {
	        var typeofSpec = typeof spec;
	        var isMixinValid = typeofSpec === 'object' && spec !== null;

	        if (process.env.NODE_ENV !== 'production') {
	          warning(
	            isMixinValid,
	            "%s: You're attempting to include a mixin that is either null " +
	              'or not an object. Check the mixins included by the component, ' +
	              'as well as any mixins they include themselves. ' +
	              'Expected object but got %s.',
	            Constructor.displayName || 'ReactClass',
	            spec === null ? null : typeofSpec
	          );
	        }
	      }

	      return;
	    }

	    _invariant(
	      typeof spec !== 'function',
	      "ReactClass: You're attempting to " +
	        'use a component class or function as a mixin. Instead, just use a ' +
	        'regular object.'
	    );
	    _invariant(
	      !isValidElement(spec),
	      "ReactClass: You're attempting to " +
	        'use a component as a mixin. Instead, just use a regular object.'
	    );

	    var proto = Constructor.prototype;
	    var autoBindPairs = proto.__reactAutoBindPairs;

	    // By handling mixins before any other properties, we ensure the same
	    // chaining order is applied to methods with DEFINE_MANY policy, whether
	    // mixins are listed before or after these methods in the spec.
	    if (spec.hasOwnProperty(MIXINS_KEY)) {
	      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
	    }

	    for (var name in spec) {
	      if (!spec.hasOwnProperty(name)) {
	        continue;
	      }

	      if (name === MIXINS_KEY) {
	        // We have already handled mixins in a special case above.
	        continue;
	      }

	      var property = spec[name];
	      var isAlreadyDefined = proto.hasOwnProperty(name);
	      validateMethodOverride(isAlreadyDefined, name);

	      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
	        RESERVED_SPEC_KEYS[name](Constructor, property);
	      } else {
	        // Setup methods on prototype:
	        // The following member methods should not be automatically bound:
	        // 1. Expected ReactClass methods (in the "interface").
	        // 2. Overridden methods (that were mixed in).
	        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
	        var isFunction = typeof property === 'function';
	        var shouldAutoBind =
	          isFunction &&
	          !isReactClassMethod &&
	          !isAlreadyDefined &&
	          spec.autobind !== false;

	        if (shouldAutoBind) {
	          autoBindPairs.push(name, property);
	          proto[name] = property;
	        } else {
	          if (isAlreadyDefined) {
	            var specPolicy = ReactClassInterface[name];

	            // These cases should already be caught by validateMethodOverride.
	            _invariant(
	              isReactClassMethod &&
	                (specPolicy === 'DEFINE_MANY_MERGED' ||
	                  specPolicy === 'DEFINE_MANY'),
	              'ReactClass: Unexpected spec policy %s for key %s ' +
	                'when mixing in component specs.',
	              specPolicy,
	              name
	            );

	            // For methods which are defined more than once, call the existing
	            // methods before calling the new property, merging if appropriate.
	            if (specPolicy === 'DEFINE_MANY_MERGED') {
	              proto[name] = createMergedResultFunction(proto[name], property);
	            } else if (specPolicy === 'DEFINE_MANY') {
	              proto[name] = createChainedFunction(proto[name], property);
	            }
	          } else {
	            proto[name] = property;
	            if (process.env.NODE_ENV !== 'production') {
	              // Add verbose displayName to the function, which helps when looking
	              // at profiling tools.
	              if (typeof property === 'function' && spec.displayName) {
	                proto[name].displayName = spec.displayName + '_' + name;
	              }
	            }
	          }
	        }
	      }
	    }
	  }

	  function mixStaticSpecIntoComponent(Constructor, statics) {
	    if (!statics) {
	      return;
	    }

	    for (var name in statics) {
	      var property = statics[name];
	      if (!statics.hasOwnProperty(name)) {
	        continue;
	      }

	      var isReserved = name in RESERVED_SPEC_KEYS;
	      _invariant(
	        !isReserved,
	        'ReactClass: You are attempting to define a reserved ' +
	          'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
	          'as an instance property instead; it will still be accessible on the ' +
	          'constructor.',
	        name
	      );

	      var isAlreadyDefined = name in Constructor;
	      if (isAlreadyDefined) {
	        var specPolicy = ReactClassStaticInterface.hasOwnProperty(name)
	          ? ReactClassStaticInterface[name]
	          : null;

	        _invariant(
	          specPolicy === 'DEFINE_MANY_MERGED',
	          'ReactClass: You are attempting to define ' +
	            '`%s` on your component more than once. This conflict may be ' +
	            'due to a mixin.',
	          name
	        );

	        Constructor[name] = createMergedResultFunction(Constructor[name], property);

	        return;
	      }

	      Constructor[name] = property;
	    }
	  }

	  /**
	   * Merge two objects, but throw if both contain the same key.
	   *
	   * @param {object} one The first object, which is mutated.
	   * @param {object} two The second object
	   * @return {object} one after it has been mutated to contain everything in two.
	   */
	  function mergeIntoWithNoDuplicateKeys(one, two) {
	    _invariant(
	      one && two && typeof one === 'object' && typeof two === 'object',
	      'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'
	    );

	    for (var key in two) {
	      if (two.hasOwnProperty(key)) {
	        _invariant(
	          one[key] === undefined,
	          'mergeIntoWithNoDuplicateKeys(): ' +
	            'Tried to merge two objects with the same key: `%s`. This conflict ' +
	            'may be due to a mixin; in particular, this may be caused by two ' +
	            'getInitialState() or getDefaultProps() methods returning objects ' +
	            'with clashing keys.',
	          key
	        );
	        one[key] = two[key];
	      }
	    }
	    return one;
	  }

	  /**
	   * Creates a function that invokes two functions and merges their return values.
	   *
	   * @param {function} one Function to invoke first.
	   * @param {function} two Function to invoke second.
	   * @return {function} Function that invokes the two argument functions.
	   * @private
	   */
	  function createMergedResultFunction(one, two) {
	    return function mergedResult() {
	      var a = one.apply(this, arguments);
	      var b = two.apply(this, arguments);
	      if (a == null) {
	        return b;
	      } else if (b == null) {
	        return a;
	      }
	      var c = {};
	      mergeIntoWithNoDuplicateKeys(c, a);
	      mergeIntoWithNoDuplicateKeys(c, b);
	      return c;
	    };
	  }

	  /**
	   * Creates a function that invokes two functions and ignores their return vales.
	   *
	   * @param {function} one Function to invoke first.
	   * @param {function} two Function to invoke second.
	   * @return {function} Function that invokes the two argument functions.
	   * @private
	   */
	  function createChainedFunction(one, two) {
	    return function chainedFunction() {
	      one.apply(this, arguments);
	      two.apply(this, arguments);
	    };
	  }

	  /**
	   * Binds a method to the component.
	   *
	   * @param {object} component Component whose method is going to be bound.
	   * @param {function} method Method to be bound.
	   * @return {function} The bound method.
	   */
	  function bindAutoBindMethod(component, method) {
	    var boundMethod = method.bind(component);
	    if (process.env.NODE_ENV !== 'production') {
	      boundMethod.__reactBoundContext = component;
	      boundMethod.__reactBoundMethod = method;
	      boundMethod.__reactBoundArguments = null;
	      var componentName = component.constructor.displayName;
	      var _bind = boundMethod.bind;
	      boundMethod.bind = function(newThis) {
	        for (
	          var _len = arguments.length,
	            args = Array(_len > 1 ? _len - 1 : 0),
	            _key = 1;
	          _key < _len;
	          _key++
	        ) {
	          args[_key - 1] = arguments[_key];
	        }

	        // User is trying to bind() an autobound method; we effectively will
	        // ignore the value of "this" that the user is trying to use, so
	        // let's warn.
	        if (newThis !== component && newThis !== null) {
	          if (process.env.NODE_ENV !== 'production') {
	            warning(
	              false,
	              'bind(): React component methods may only be bound to the ' +
	                'component instance. See %s',
	              componentName
	            );
	          }
	        } else if (!args.length) {
	          if (process.env.NODE_ENV !== 'production') {
	            warning(
	              false,
	              'bind(): You are binding a component method to the component. ' +
	                'React does this for you automatically in a high-performance ' +
	                'way, so you can safely remove this call. See %s',
	              componentName
	            );
	          }
	          return boundMethod;
	        }
	        var reboundMethod = _bind.apply(boundMethod, arguments);
	        reboundMethod.__reactBoundContext = component;
	        reboundMethod.__reactBoundMethod = method;
	        reboundMethod.__reactBoundArguments = args;
	        return reboundMethod;
	      };
	    }
	    return boundMethod;
	  }

	  /**
	   * Binds all auto-bound methods in a component.
	   *
	   * @param {object} component Component whose method is going to be bound.
	   */
	  function bindAutoBindMethods(component) {
	    var pairs = component.__reactAutoBindPairs;
	    for (var i = 0; i < pairs.length; i += 2) {
	      var autoBindKey = pairs[i];
	      var method = pairs[i + 1];
	      component[autoBindKey] = bindAutoBindMethod(component, method);
	    }
	  }

	  var IsMountedPreMixin = {
	    componentDidMount: function() {
	      this.__isMounted = true;
	    }
	  };

	  var IsMountedPostMixin = {
	    componentWillUnmount: function() {
	      this.__isMounted = false;
	    }
	  };

	  /**
	   * Add more to the ReactClass base class. These are all legacy features and
	   * therefore not already part of the modern ReactComponent.
	   */
	  var ReactClassMixin = {
	    /**
	     * TODO: This will be deprecated because state should always keep a consistent
	     * type signature and the only use case for this, is to avoid that.
	     */
	    replaceState: function(newState, callback) {
	      this.updater.enqueueReplaceState(this, newState, callback);
	    },

	    /**
	     * Checks whether or not this composite component is mounted.
	     * @return {boolean} True if mounted, false otherwise.
	     * @protected
	     * @final
	     */
	    isMounted: function() {
	      if (process.env.NODE_ENV !== 'production') {
	        warning(
	          this.__didWarnIsMounted,
	          '%s: isMounted is deprecated. Instead, make sure to clean up ' +
	            'subscriptions and pending requests in componentWillUnmount to ' +
	            'prevent memory leaks.',
	          (this.constructor && this.constructor.displayName) ||
	            this.name ||
	            'Component'
	        );
	        this.__didWarnIsMounted = true;
	      }
	      return !!this.__isMounted;
	    }
	  };

	  var ReactClassComponent = function() {};
	  _assign(
	    ReactClassComponent.prototype,
	    ReactComponent.prototype,
	    ReactClassMixin
	  );

	  /**
	   * Creates a composite component class given a class specification.
	   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
	   *
	   * @param {object} spec Class specification (which must define `render`).
	   * @return {function} Component constructor function.
	   * @public
	   */
	  function createClass(spec) {
	    // To keep our warnings more understandable, we'll use a little hack here to
	    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
	    // unnecessarily identify a class without displayName as 'Constructor'.
	    var Constructor = identity(function(props, context, updater) {
	      // This constructor gets overridden by mocks. The argument is used
	      // by mocks to assert on what gets mounted.

	      if (process.env.NODE_ENV !== 'production') {
	        warning(
	          this instanceof Constructor,
	          'Something is calling a React component directly. Use a factory or ' +
	            'JSX instead. See: https://fb.me/react-legacyfactory'
	        );
	      }

	      // Wire up auto-binding
	      if (this.__reactAutoBindPairs.length) {
	        bindAutoBindMethods(this);
	      }

	      this.props = props;
	      this.context = context;
	      this.refs = emptyObject;
	      this.updater = updater || ReactNoopUpdateQueue;

	      this.state = null;

	      // ReactClasses doesn't have constructors. Instead, they use the
	      // getInitialState and componentWillMount methods for initialization.

	      var initialState = this.getInitialState ? this.getInitialState() : null;
	      if (process.env.NODE_ENV !== 'production') {
	        // We allow auto-mocks to proceed as if they're returning null.
	        if (
	          initialState === undefined &&
	          this.getInitialState._isMockFunction
	        ) {
	          // This is probably bad practice. Consider warning here and
	          // deprecating this convenience.
	          initialState = null;
	        }
	      }
	      _invariant(
	        typeof initialState === 'object' && !Array.isArray(initialState),
	        '%s.getInitialState(): must return an object or null',
	        Constructor.displayName || 'ReactCompositeComponent'
	      );

	      this.state = initialState;
	    });
	    Constructor.prototype = new ReactClassComponent();
	    Constructor.prototype.constructor = Constructor;
	    Constructor.prototype.__reactAutoBindPairs = [];

	    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

	    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
	    mixSpecIntoComponent(Constructor, spec);
	    mixSpecIntoComponent(Constructor, IsMountedPostMixin);

	    // Initialize the defaultProps property after all mixins have been merged.
	    if (Constructor.getDefaultProps) {
	      Constructor.defaultProps = Constructor.getDefaultProps();
	    }

	    if (process.env.NODE_ENV !== 'production') {
	      // This is a tag to indicate that the use of these method names is ok,
	      // since it's used with createClass. If it's not, then it's likely a
	      // mistake so we'll warn you to use the static property, property
	      // initializer or constructor respectively.
	      if (Constructor.getDefaultProps) {
	        Constructor.getDefaultProps.isReactClassApproved = {};
	      }
	      if (Constructor.prototype.getInitialState) {
	        Constructor.prototype.getInitialState.isReactClassApproved = {};
	      }
	    }

	    _invariant(
	      Constructor.prototype.render,
	      'createClass(...): Class specification must implement a `render` method.'
	    );

	    if (process.env.NODE_ENV !== 'production') {
	      warning(
	        !Constructor.prototype.componentShouldUpdate,
	        '%s has a method called ' +
	          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
	          'The name is phrased as a question because the function is ' +
	          'expected to return a value.',
	        spec.displayName || 'A component'
	      );
	      warning(
	        !Constructor.prototype.componentWillRecieveProps,
	        '%s has a method called ' +
	          'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
	        spec.displayName || 'A component'
	      );
	      warning(
	        !Constructor.prototype.UNSAFE_componentWillRecieveProps,
	        '%s has a method called UNSAFE_componentWillRecieveProps(). ' +
	          'Did you mean UNSAFE_componentWillReceiveProps()?',
	        spec.displayName || 'A component'
	      );
	    }

	    // Reduce time spent doing lookups by setting these on the prototype.
	    for (var methodName in ReactClassInterface) {
	      if (!Constructor.prototype[methodName]) {
	        Constructor.prototype[methodName] = null;
	      }
	    }

	    return Constructor;
	  }

	  return createClass;
	}

	module.exports = factory;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var emptyObject = {};

	if (process.env.NODE_ENV !== 'production') {
	  Object.freeze(emptyObject);
	}

	module.exports = emptyObject;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (process.env.NODE_ENV !== 'production') {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var emptyFunction = __webpack_require__(10);

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction;

	if (process.env.NODE_ENV !== 'production') {
	  (function () {
	    var printWarning = function printWarning(format) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // --- Welcome to debugging React ---
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch (x) {}
	    };

	    warning = function warning(condition, format) {
	      if (format === undefined) {
	        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	      }

	      if (format.indexOf('Failed Composite propType: ') === 0) {
	        return; // Ignore CompositeComponent proptype check.
	      }

	      if (!condition) {
	        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	          args[_key2 - 2] = arguments[_key2];
	        }

	        printWarning.apply(undefined, [format].concat(args));
	      }
	    };
	  })();
	}

	module.exports = warning;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Copyright (c) 2015-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	(function(f) {
	  if (true) {
	    module.exports = f(__webpack_require__(2));
	    /* global define */
	  } else if (typeof define === 'function' && define.amd) {
	    define(['react'], f);
	  } else {
	    var g;
	    if (typeof window !== 'undefined') {
	      g = window;
	    } else if (typeof global !== 'undefined') {
	      g = global;
	    } else if (typeof self !== 'undefined') {
	      g = self;
	    } else {
	      g = this;
	    }

	    if (typeof g.React === 'undefined') {
	      throw Error('React module should be required before ReactDOMFactories');
	    }

	    g.ReactDOMFactories = f(g.React);
	  }
	})(function(React) {
	  /**
	   * Create a factory that creates HTML tag elements.
	   */
	  function createDOMFactory(type) {
	    var factory = React.createElement.bind(null, type);
	    // Expose the type on the factory and the prototype so that it can be
	    // easily accessed on elements. E.g. `<Foo />.type === Foo`.
	    // This should not be named `constructor` since this may not be the function
	    // that created the element, and it may not even be a constructor.
	    factory.type = type;
	    return factory;
	  };

	  /**
	   * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
	   */
	  var ReactDOMFactories = {
	    a: createDOMFactory('a'),
	    abbr: createDOMFactory('abbr'),
	    address: createDOMFactory('address'),
	    area: createDOMFactory('area'),
	    article: createDOMFactory('article'),
	    aside: createDOMFactory('aside'),
	    audio: createDOMFactory('audio'),
	    b: createDOMFactory('b'),
	    base: createDOMFactory('base'),
	    bdi: createDOMFactory('bdi'),
	    bdo: createDOMFactory('bdo'),
	    big: createDOMFactory('big'),
	    blockquote: createDOMFactory('blockquote'),
	    body: createDOMFactory('body'),
	    br: createDOMFactory('br'),
	    button: createDOMFactory('button'),
	    canvas: createDOMFactory('canvas'),
	    caption: createDOMFactory('caption'),
	    cite: createDOMFactory('cite'),
	    code: createDOMFactory('code'),
	    col: createDOMFactory('col'),
	    colgroup: createDOMFactory('colgroup'),
	    data: createDOMFactory('data'),
	    datalist: createDOMFactory('datalist'),
	    dd: createDOMFactory('dd'),
	    del: createDOMFactory('del'),
	    details: createDOMFactory('details'),
	    dfn: createDOMFactory('dfn'),
	    dialog: createDOMFactory('dialog'),
	    div: createDOMFactory('div'),
	    dl: createDOMFactory('dl'),
	    dt: createDOMFactory('dt'),
	    em: createDOMFactory('em'),
	    embed: createDOMFactory('embed'),
	    fieldset: createDOMFactory('fieldset'),
	    figcaption: createDOMFactory('figcaption'),
	    figure: createDOMFactory('figure'),
	    footer: createDOMFactory('footer'),
	    form: createDOMFactory('form'),
	    h1: createDOMFactory('h1'),
	    h2: createDOMFactory('h2'),
	    h3: createDOMFactory('h3'),
	    h4: createDOMFactory('h4'),
	    h5: createDOMFactory('h5'),
	    h6: createDOMFactory('h6'),
	    head: createDOMFactory('head'),
	    header: createDOMFactory('header'),
	    hgroup: createDOMFactory('hgroup'),
	    hr: createDOMFactory('hr'),
	    html: createDOMFactory('html'),
	    i: createDOMFactory('i'),
	    iframe: createDOMFactory('iframe'),
	    img: createDOMFactory('img'),
	    input: createDOMFactory('input'),
	    ins: createDOMFactory('ins'),
	    kbd: createDOMFactory('kbd'),
	    keygen: createDOMFactory('keygen'),
	    label: createDOMFactory('label'),
	    legend: createDOMFactory('legend'),
	    li: createDOMFactory('li'),
	    link: createDOMFactory('link'),
	    main: createDOMFactory('main'),
	    map: createDOMFactory('map'),
	    mark: createDOMFactory('mark'),
	    menu: createDOMFactory('menu'),
	    menuitem: createDOMFactory('menuitem'),
	    meta: createDOMFactory('meta'),
	    meter: createDOMFactory('meter'),
	    nav: createDOMFactory('nav'),
	    noscript: createDOMFactory('noscript'),
	    object: createDOMFactory('object'),
	    ol: createDOMFactory('ol'),
	    optgroup: createDOMFactory('optgroup'),
	    option: createDOMFactory('option'),
	    output: createDOMFactory('output'),
	    p: createDOMFactory('p'),
	    param: createDOMFactory('param'),
	    picture: createDOMFactory('picture'),
	    pre: createDOMFactory('pre'),
	    progress: createDOMFactory('progress'),
	    q: createDOMFactory('q'),
	    rp: createDOMFactory('rp'),
	    rt: createDOMFactory('rt'),
	    ruby: createDOMFactory('ruby'),
	    s: createDOMFactory('s'),
	    samp: createDOMFactory('samp'),
	    script: createDOMFactory('script'),
	    section: createDOMFactory('section'),
	    select: createDOMFactory('select'),
	    small: createDOMFactory('small'),
	    source: createDOMFactory('source'),
	    span: createDOMFactory('span'),
	    strong: createDOMFactory('strong'),
	    style: createDOMFactory('style'),
	    sub: createDOMFactory('sub'),
	    summary: createDOMFactory('summary'),
	    sup: createDOMFactory('sup'),
	    table: createDOMFactory('table'),
	    tbody: createDOMFactory('tbody'),
	    td: createDOMFactory('td'),
	    textarea: createDOMFactory('textarea'),
	    tfoot: createDOMFactory('tfoot'),
	    th: createDOMFactory('th'),
	    thead: createDOMFactory('thead'),
	    time: createDOMFactory('time'),
	    title: createDOMFactory('title'),
	    tr: createDOMFactory('tr'),
	    track: createDOMFactory('track'),
	    u: createDOMFactory('u'),
	    ul: createDOMFactory('ul'),
	    var: createDOMFactory('var'),
	    video: createDOMFactory('video'),
	    wbr: createDOMFactory('wbr'),

	    // SVG
	    circle: createDOMFactory('circle'),
	    clipPath: createDOMFactory('clipPath'),
	    defs: createDOMFactory('defs'),
	    ellipse: createDOMFactory('ellipse'),
	    g: createDOMFactory('g'),
	    image: createDOMFactory('image'),
	    line: createDOMFactory('line'),
	    linearGradient: createDOMFactory('linearGradient'),
	    mask: createDOMFactory('mask'),
	    path: createDOMFactory('path'),
	    pattern: createDOMFactory('pattern'),
	    polygon: createDOMFactory('polygon'),
	    polyline: createDOMFactory('polyline'),
	    radialGradient: createDOMFactory('radialGradient'),
	    rect: createDOMFactory('rect'),
	    stop: createDOMFactory('stop'),
	    svg: createDOMFactory('svg'),
	    text: createDOMFactory('text'),
	    tspan: createDOMFactory('tspan'),
	  };

	  // due to wrapper and conditionals at the top, this will either become
	  // `module.exports ReactDOMFactories` if that is available,
	  // otherwise it will be defined via `define(['react'], ReactDOMFactories)`
	  // if that is available,
	  // otherwise it will be defined as global variable.
	  return ReactDOMFactories;
	});



/***/ }),
/* 12 */
/***/ (function(module, exports) {

	/*
	The MIT License (MIT)
	Copyright (c) 2014 The Australian National University
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	*/

	'use strict';

	var isNat = function(x) {
	  return typeof x == 'number' && x >= 0 && x % 1 == 0;
	};

	var object = function() {
	  var args = Array.prototype.slice.call(arguments);
	  var result = [];
	  var i;

	  for (i = 0; i+1 < args.length; i += 2)
	    if (!isNat(args[i]))
	      result = {};

	  for (i = 0; i+1 < args.length; i += 2)
	    result[args[i]] = args[i + 1];

	  return result;
	};


	var merge = function() {
	  var args = Array.prototype.slice.call(arguments);
	  var result = args.every(Array.isArray) ? [] : {};
	  var i, obj, key;
	  for (i in args) {
	    obj = args[i];
	    for (key in obj)
	      result[key] = obj[key];
	  }
	  return result;
	};


	var getIn = function(root, path) {
	  if (path.length == 0 || root == undefined)
	    return root;
	  else
	    return getIn(root[path[0]], path.slice(1))
	};


	var setIn = function(root, path, value) {
	  if (path.length == 0)
	    return value;
	  else {
	    var child = (root == null) ? null : root[path[0]];
	    var value = setIn(child || [], path.slice(1), value);
	    return merge(root, object(path[0], value));
	  }
	};


	var without = function(obj) {
	  var args = [].slice.call(arguments);
	  var result = Array.isArray(obj) ? [] : {};

	  for (var key in obj)
	    if (args.indexOf(key) < 0)
	      result[key] = obj[key];

	  return result;
	};

	var prune = function(root) {
	  var result, isArray, key, val, nullValues, childResult;

	    if (root == null || root === '')
	      result = null;
	    else if (root.constructor === Array || root.constructor === Object) {
	      isArray = Array.isArray(root);
	      result = isArray ? [] : {};
	      for (key in root) {
	        if (root.hasOwnProperty(key)) {
	          childResult = prune(root[key]);
	          val = childResult.value;
	          nullValues |= childResult.nullValues;
	          if (val !== null) {
	            if (isArray)
	              result.push(val);
	            else
	              result[key] = val;
	          } else {
	            nullValues = true;
	          }
	        }
	      }

	      if (!nullValues) {
	        result = root;
	      }

	      if (Object.keys(result).length === 0) {
	        result = null;
	      }
	    } else
	      result = root;

	    return {
	      value: result,
	      nullValues: nullValues
	    };
	};


	var split = function(pred, obj) {
	  var good = {};
	  var bad = {};

	  for (key in obj) {
	    var val = obj[key];
	    if (pred(key, val))
	      good[key] = val;
	    else
	      bad[key] = val;
	  }

	  return [good, bad];
	};


	var map = function(fn, obj) {
	  var output = {};
	  var key;

	  for (key in obj)
	    output[key] = fn(obj[key]);

	  return output;
	};


	var mapKeys = function(fn, obj) {
	  var output = {};
	  var key;

	  for (key in obj)
	    output[fn(key)] = obj[key];

	  return output;
	};


	module.exports = {
	  object : object,
	  merge  : merge,
	  without: without,
	  getIn  : getIn,
	  setIn  : setIn,
	  prune  : prune,
	  split  : split,
	  map    : map,
	  mapKeys: mapKeys
	};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	    CheckBox: __webpack_require__(14),
	    FileField: __webpack_require__(15),
	    InputField: __webpack_require__(20),
	    UserDefinedField: __webpack_require__(23),
	    Selection: __webpack_require__(24),
	    make: __webpack_require__(25),
	};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var $ = React.DOM;


	var CheckBox = React.createClass({
	  displayName: 'CheckBox',

	  handleChange: function(event) {
	    var val = event.target.checked ? true : null;
	    this.props.update(this.props.path, val, val);
	  },
	  render: function() {
	    return $.input({
	      name: this.props.label,
	      type: "checkbox",
	      checked: this.props.value || false,
	      onChange: this.handleChange,
	      disabled: this.props.disabled });
	  }
	});

	module.exports = CheckBox;



/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var $ = React.DOM;

	var ou = __webpack_require__(12);

	var types = __webpack_require__(16);
	var wrapped = __webpack_require__(19);


	var FileField = React.createClass({
	  displayName: 'FileField',

	  loadFile: function(event) {
	    var reader = new FileReader();
	    var file = event.target.files[0];
	    var val = ou.merge(this.props.getValue(this.props.path), {
	      name: file.name,
	      type: file.type,
	      size: file.size
	    });

	    this.props.update(this.props.path, val, val);

	    reader.onload = function(event) {
	      val.data = event.target.result;
	      this.props.update(this.props.path, val, val);
	    }.bind(this);

	    if (file) {
	      if (this.props.mode === 'dataURL') {
	        reader.readAsDataURL(file);
	      }
	      else {
	        reader.readAsText(file);
	      }
	    }
	  },
	  render: function() {
	    var fields = this.props.fields || {};
	    var value = this.props.value || {};
	    var list = [
	      $.input({ key: "input", type: "file", onChange: this.loadFile }),
	      $.dl({ key: "fileProperties" },
	           $.dt(null, "Name"), $.dd(null, value.name || '-'),
	           $.dt(null, "Size"), $.dd(null, value.size || '-'),
	           $.dt(null, "Type"), $.dd(null, value.type || '-'))
	    ];

	    return wrapped.section(this.props, list.concat(types.object(fields, this.props)));
	  }
	});

	module.exports = FileField;



/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ou = __webpack_require__(12);

	var alternative = __webpack_require__(17);


	var types = {
	  alternative: function(fields, props) {
	    var s = alternative.schema(props.getValue(props.path), props.schema, props.context);

	    return types.object(fields, ou.merge(props, { schema: s }));
	  },
	  array: function(fields, props) {
	    return function() {
	      var move = function(props, i, n) {
	        return function(to) {
	          if(!canMoveUp(i, n) && !canMoveDown(i, n)) return;
	          var newList = props.getValue(props.path);
	          var value = newList.splice(to, 1);

	          newList.splice(i, 0, value[0]);
	          props.update(props.path, newList, newList);
	        };
	      };
	      var canMoveUp = function(i, n) {
	        return i > 0 && i < n - 1;
	      };
	      var moveUp = function(props, i, n) {
	        return function() {
	          if(!canMoveUp(i, n)) return;
	          var newList = props.getValue(props.path);
	          var value = newList.splice(i, 1);

	          newList.splice(i - 1, 0, value[0]);
	          props.update(props.path, newList, newList);
	        };
	      };

	      var canMoveDown = function(i, n) {
	        return n > 1 && i < n - 2;
	      };
	      var moveDown = function(props, i, n) {
	        return function() {
	          if(!canMoveDown(i, n)) return;
	          var newList = props.getValue(props.path);
	          var value = newList.splice(i, 1);

	          newList.splice(i + 1, 0, value[0]);
	          props.update(props.path, newList, newList);
	        };
	      };

	      var canRemoveItem = function(i, n) {
	        return i < n;
	      };

	      var removeItem = function(props, i, n) {
	        return function() {
	          if(!canRemoveItem(i, n)) return;

	          var newList = props.getValue(props.path);
	          newList.splice(i, 1);
	          props.update(props.path, newList, newList);
	        };
	      };

	      var n = (props.getValue(props.path) || []).length + 1;
	      var list = [];
	      for (var i = 0; i < n; ++i) {
	        list.push(fields.make(fields, ou.merge(props, {
	          schema       : props.schema.items,
	          path         : props.path.concat(i),
	          move         : move(props, i, n),
	          moveUp       : moveUp(props, i, n),
	          moveDown     : moveDown(props, i, n),
	          canMoveUp    : canMoveUp(i, n),
	          canMoveDown  : canMoveDown(i, n),
	          removeItem   : removeItem(props, i, n),
	          canRemoveItem: canRemoveItem(i, n)
	        })));
	      }

	      return list;
	    };
	  },
	  object: function(fields, props) {
	    return function() {
	      var keys = fullOrdering(props.schema['x-ordering'], props.schema.properties);
	      return keys.map(function(key) {
	        return fields.make(fields, ou.merge(props, {
	          schema: props.schema.properties[key],
	          path  : props.path.concat(key)
	        }));
	      });
	    };
	  },
	};

	module.exports = types;

	function fullOrdering(list, obj) {
	  var keys = Object.keys(obj || {});
	  var result = [];
	  var i, k;

	  for (i in list || []) {
	    k = list[i];
	    if (keys.indexOf(k) >= 0) {
	      result.push(k);
	    }
	  }

	  for (i in keys) {
	    k = keys[i];
	    if (result.indexOf(k) < 0) {
	      result.push(k);
	    }
	  }

	  return result;
	}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ou = __webpack_require__(12);
	var resolve = __webpack_require__(18);

	exports.schema = function(value, schema, context) {
	  var selector, options, selected;

	  selector = ou.getIn(schema, ['x-hints', 'form', 'selector']);
	  if (!selector) {
	    return;
	  }

	  var dereferenced = schema.oneOf.map(function(alt) {
	    return resolve(alt, context);
	  });

	  options = dereferenced.map(function(alt) {
	    return ou.getIn(alt, [ 'properties', selector, 'enum', 0 ]) || "";
	  });

	  selected = (value || {})[selector] || options[0];

	  return ou.merge(ou.setIn(dereferenced[options.indexOf(selected)],
	                           [ 'properties', selector ],
	                           ou.merge(ou.getIn(schema, [ 'properties', selector]),
	                                    { enum: options })),
	                  { type: 'object' });
	};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ou = __webpack_require__(12);


	module.exports = function(schema, context) {
	  var reference = schema['$ref'];

	  if (reference) {
	    if (!reference.match(/^#(\/([a-zA-Z_][a-zA-Z_0-9]*|[0-9]+))*$/)) {
	      throw new Error('reference '+reference+' has unsupported format');
	    }

	    return ou.merge(
	      ou.getIn(context, reference.split('/').slice(1)),
	      without(schema, '$ref'));
	  }
	  else {
	    return schema;
	  }
	};

	function without(obj) {
	  var args = [].slice.call(arguments);
	  var result = Array.isArray(obj) ? [] : {};

	  for (var key in obj) {
	    if (args.indexOf(key) < 0) {
	      result[key] = obj[key];
	    }
	  }

	  return result;
	}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var $ = React.DOM;

	var ou = __webpack_require__(12);


	var errorClass = function(errors) {
	  if(!errors || errors.length === 0) {
	    return '';
	  }

	  return 'error';
	};

	var makeTitle = function(description, errors) {
	  var parts = [];
	  if (description && description.length > 0) {
	    parts.push(description);
	  }
	  if (errors && errors.length > 0) {
	    parts.push(errors.join('\n'));
	  }
	  return parts.join('\n\n');
	};

	var FieldWrapper = React.createClass({displayName: "FieldWrapper",
	  shouldComponentUpdate: function(nextProps) {
	    return this.props.value !== nextProps.value;
	  },
	  render: function() {
	    var classes = [].concat(errorClass(this.props.errors) || [],
	                            'form-element',
	                            this.props.classes || []);

	    return $.div(
	      {
	        className: classes.join(' '),
	        key      : this.props.label,
	        title    : makeTitle(this.props.description, this.props.errors)
	      },
	      $.label(
	        {
	          htmlFor: this.props.label
	        },
	        this.props.title),
	      this.props.children);
	  }
	});

	var SectionWrapper = React.createClass({displayName: "SectionWrapper",
	  shouldComponentUpdate: function(nextProps) {
	    return this.props.value !== nextProps.value;
	  },
	  render: function() {
	    var level = this.props.path.length;
	    var classes = [].concat('form-section',
	                            (level > 0 ? 'form-subsection' : []),
	                            this.props.classes || []);
	    var legendClasses = [].concat(errorClass(this.props.errors) || [],
	                                  'form-section-title');

	    return $.fieldset(
	      {
	        className: classes.join(' '),
	        key      : this.props.label
	      },
	      $.legend(
	        {
	          className: legendClasses.join(' '),
	          title    : makeTitle(this.props.description, this.props.errors)
	        },
	        this.props.title),
	      this.props.children);
	  }
	});

	var propsForWrapper = function(props, section) {
	  var propsFW = {
	    key        : props.key,
	    label      : props.label,
	    path       : props.path,
	    errors     : props.errors,
	    classes    : ou.getIn(props.schema, ['x-hints', 'form', 'classes']),
	    title      : props.schema.title,
	    type       : props.schema.type,
	    description: props.schema.description,
	    schema     : props.schema,
	    value      : props.value
	  };

	  if(section && props.isArrayItem) {
	    if(props.isArrayItem) {
	      var vals = props.getValue(props.path);
	      var title = props.title;
	      if(vals) {
	        var itemHeaderKey = ou.getIn(props.schema, ['x-hints', 'itemHeader', "property"]);
	        var itemHeader = (itemHeaderKey && vals[itemHeaderKey]) || vals.title || vals.name;
	        title = title && itemHeader ? title + " - " + itemHeader : itemHeader || title;
	      }

	      propsFW = ou.merge(propsFW, {
	        title        : title || propsFW.title,
	        move         : props.move,
	        moveUp       : props.moveUp,
	        moveDown     : props.moveDown,
	        canMoveUp    : props.canMoveUp,
	        canMoveDown  : props.canMoveDown,
	        removeItem   : props.removeItem,
	        canRemoveItem: props.canRemoveItem
	      });
	    }

	    propsFW = ou.merge(propsFW, {
	      isArrayItem: props.isArrayItem
	    });
	  }

	  return propsFW;
	};

	exports.section = function(props, fields) {
	  if (React.isValidElement(props.sectionWrapper)) {
	    return React.cloneElement(props.sectionWrapper, propsForWrapper(props, true), fields);
	  }
	  return React.createElement(props.sectionWrapper || SectionWrapper,
	    propsForWrapper(props, true),
	    fields);
	};

	exports.field = function(props, field) {
	  if (React.isValidElement(props.fieldWrapper)) {
	    return React.cloneElement(props.fieldWrapper, propsForWrapper(props), field);
	  }
	  return React.createElement(props.fieldWrapper || FieldWrapper,
	    propsForWrapper(props),
	    field);
	};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var $ = React.DOM;

	var normalizer = __webpack_require__(21);
	var parser = __webpack_require__(22);


	var InputField = React.createClass({
	  displayName: 'InputField',

	  normalize: function(text) {
	    return normalizer[this.props.type](text);
	  },
	  parse: function(text) {
	    return parser[this.props.type](text);
	  },
	  handleChange: function(event) {
	    var text = this.normalize(event.target.value);
	    this.props.update(this.props.path, text, this.parse(text));
	  },
	  handleKeyPress: function(event) {
	    if (event.keyCode === 13) {
	      event.preventDefault();
	    }
	  },
	  render: function() {
	    return $.input({
	      type      : "text",
	      disabled  : this.props.disabled,
	      hidden    : this.props.hidden,
	      name      : this.props.label,
	      value     : this.props.value || '',
	      onKeyPress: this.handleKeyPress,
	      onChange  : this.handleChange });
	  }
	});

	module.exports = InputField;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

	'use strict';


	exports.string = function(text) {
	  return text
	    .replace(/\s+/g, ' ')
	    .replace(/^ /, '')
	    .replace(/\u00ad/g, '');
	};

	exports.integer = function(text) {
	  return text
	    .replace(/[^-\d]/g, '')
	    .replace(/(.)-/g, '$1');
	};

	exports.number = function(text) {
	  return text
	    .replace(/[^-\.e\d]/ig, '')
	    .replace(/(e[^e]*)e/ig, '$1')
	    .replace(/([e.][^.]*)\./ig, '$1')
	    .replace(/([^e])-/ig, '$1')
	    .replace(/(e-?\d\d\d)\d/ig, '$1');
	};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var normalizer = __webpack_require__(21);


	exports.string = function(text) {
	  return normalizer.string(text);
	};

	exports.integer = function(text) {
	  return text ? parseInt(normalizer.integer(text)) : null;
	};

	exports.number = function(text) {
	  return text ? parseFloat(normalizer.number(text)) : null;
	};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);

	var normalizer = __webpack_require__(21);
	var parser = __webpack_require__(22);


	var UserDefinedField = React.createClass({
	  displayName: 'UserDefinedField',

	  normalize: function(text) {
	    var n = normalizer[this.props.type];
	    return n ? n(text) : text;
	  },
	  parse: function(text) {
	    var p = parser[this.props.type];
	    return p ? p(text) : text;
	  },
	  handleChange: function(value) {
	    var text = this.normalize(value);
	    this.props.update(this.props.path, text, this.parse(text));
	  },
	  handleKeyPress: function(event) {
	    if (event.keyCode === 13) {
	      event.preventDefault();
	    }
	  },
	  render: function() {
	    return React.createElement(this.props.component, {
	      name      : this.props.label,
	      schema    : this.props.schema,
	      value     : this.props.value || '',
	      onKeyPress: this.handleKeyPress,
	      onChange  : this.handleChange
	    });
	  }
	});

	module.exports = UserDefinedField;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);
	var $ = React.DOM;

	var normalizer = __webpack_require__(21);
	var parser = __webpack_require__(22);


	var Selection = React.createClass({
	  displayName: 'Selection',

	  normalize: function(text) {
	    // XXXXX: assume string in case type isn't set
	    var type = this.props.type || 'string';

	    return normalizer[type](text);
	  },
	  parse: function(text) {
	    // XXXXX: assume string in case type isn't set
	    var type = this.props.type || 'string';

	    return parser[type](text);
	  },
	  handleChange: function(event) {
	    var val = this.normalize(event.target.value);
	    this.props.update(this.props.path, val, this.parse(val));
	  },
	  render: function() {
	    var names = this.props.names;

	    return $.select(
	      {
	        name    : this.props.label,
	        value   : this.props.value || this.props.values[0],
	        onChange: this.handleChange,
	        disabled: this.props.disabled
	      },
	      this.props.values.map(function(opt, i) {
	        return $.option({ key: opt, value: opt }, names[i] || opt);
	      }));
	  }
	});

	module.exports = Selection;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);

	var ou = __webpack_require__(12);

	var resolve = __webpack_require__(18);
	var types = __webpack_require__(16);
	var wrapped = __webpack_require__(19);


	module.exports = function(fields, props) {
	  var schema = resolve(props.schema, props.context);
	  var hints = schema['x-hints'] || {};
	  var inputComponent = ou.getIn(hints, ['form', 'inputComponent']);
	  var disabled = ou.getIn(hints, ['form', 'disabled']);
	  var hidden = ou.getIn(hints,['form', 'hidden'])
	  var key = makeKey(props.path);

	  props = ou.merge(props, {
	    schema: schema,
	    key   : key,
	    label : key,
	    value : props.getValue(props.path),
	    errors: props.getErrors(props.path),
	    type  : schema.type,
	    disabled : disabled,
	    hidden : hidden
	  });

	  if(props.moveUp !== undefined) {
	    if(props.isArrayItem) {
	      delete(props.isArrayItem);
	      delete(props.canMoveUp);
	      delete(props.canMoveDown);
	      delete(props.move);
	      delete(props.moveUp);
	      delete(props.moveDown);
	    } else {
	      props.isArrayItem = true;
	    }
	  }

	  if (inputComponent) {
	    props = ou.merge(props, { component: props.handlers[inputComponent] });
	    return wrapped.field(props, React.createElement(fields.UserDefinedField, props));
	  } else if (hints.fileUpload) {
	    console.warn("DEPRECATION WARNING: built-in file upload will be removed");
	    // FileField cannot depend on fields directly (cyclic dependency)
	    props = ou.merge(props, { fields: fields });
	    return React.createElement(
	      fields.FileField, ou.merge(props, { mode: hints.fileUpload.mode }));
	  }
	  else if (schema['oneOf']) {
	    return wrapped.section(props, types.alternative(fields, props));
	  }
	  else if (schema['enum']) {
	    props = ou.merge(props, {
	        values: schema['enum'],
	        names: schema['enumNames'] || schema['enum'] });
	    return wrapped.field(props, React.createElement(fields.Selection, props));
	  }

	  switch (schema.type) {
	  case "boolean":
	    return wrapped.field(props, React.createElement(fields.CheckBox, props));
	  case "object" :
	    return wrapped.section(props, types.object(fields, props));
	  case "array"  :
	    return wrapped.section(props, types.array(fields, props));
	  case "number" :
	  case "integer":
	  case "string" :
	  default:
	    return wrapped.field(props, React.createElement(fields.InputField, props));
	  }
	};

	function makeKey(path) {
	  return path.join('_');
	}


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var ou = __webpack_require__(12);

	var alternative = __webpack_require__(17);
	var resolve = __webpack_require__(18);


	module.exports = function(data, schema, context) {
	  return ou.prune(withDefaultOptions(data, schema, context)).value;
	};

	function withDefaultOptions(data, schema, context) {
	  var result;
	  var key;
	  var effectiveSchema = resolve(schema, context);

	  if (effectiveSchema.oneOf) {
	    effectiveSchema = alternative.schema(data, effectiveSchema, context);
	  }

	  if (effectiveSchema['enum']) {
	    result = data || effectiveSchema['enum'][0];
	  } else if (effectiveSchema.type === 'object') {
	    var property;
	    result = data;
	    for (key in effectiveSchema.properties) {
	      property = (data || {})[key];
	      if (property) {
	        result[key] = withDefaultOptions(property, effectiveSchema.properties[key], context);
	      }
	    }
	  } else if (effectiveSchema.type === 'array') {
	    var item;
	    var arrayLength = (data || []).length;
	    result = arrayLength > 0 ? [] : data;
	    for (key = 0; key < arrayLength; ++key) {
	      item = (data || [])[key];
	      if (item) {
	        result[key] = withDefaultOptions(item, effectiveSchema.items, context);
	      }
	    }
	  } else {
	    result = data;
	  }
	  return result;
	}


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	The MIT License (MIT)
	Copyright (c) 2014 The Australian National University
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	*/

	'use strict';

	var ou = __webpack_require__(12);
	var alternative = __webpack_require__(17);

	var checkNumber = function(schema, instance) {
	  var errors = [];

	  if (schema.maximum !== null) {
	    if (instance > schema.maximum)
	      errors.push('may be at most ' + schema.maximum);
	    else if (schema.exclusiveMaximum && instance >= schema.maximum)
	      errors.push('must be less than ' + schema.maximum);
	  }
	  if (schema.minimum !== null) {
	    if (instance < schema.minimum)
	      errors.push('must be at least ' + schema.minimum);
	    else if (schema.exclusiveMinimum && instance <= schema.minimum)
	      errors.push('must be more than ' + schema.minimum);
	  }
	  if (schema.multipleOf != null) {
	    if ((instance / schema.multipleOf) % 1 != 0)
	      errors.push('must be a multiple of ' + schema.multipleOf);
	  }

	  return errors;
	};


	var fieldErrors = function(errors) {
	  if (errors.length > 0)
	    return [ { path: [], errors: errors } ];
	  else
	    return [];
	};


	var validator = {};


	validator.boolean = function(schema, instance) {
	  var errors = [];

	  if (typeof instance != 'boolean')
	    errors.push('must be boolean');

	  return fieldErrors(errors);
	};


	validator.enum = function(schema, instance) {
	  var errors = [];

	  if (schema.enum.indexOf(instance) < 0)
	    errors.push('value not in list');

	  return fieldErrors(errors);
	};


	validator.number = function(schema, instance) {
	  var errors = [];

	  if (typeof instance != 'number')
	    errors.push('must be a number');
	  else
	    errors = checkNumber(schema, instance);

	  return fieldErrors(errors);
	};


	validator.integer = function(schema, instance) {
	  var errors = [];

	  if (typeof instance != 'number')
	    errors.push('must be a number');
	  else {
	    errors = checkNumber(schema, instance);
	    if (instance % 1 > 0)
	      errors.unshift('must be an integer');
	  }

	  return fieldErrors(errors);
	};


	validator.string = function(schema, instance) {
	  var errors = [];

	  if (typeof instance != 'string')
	    errors.push('must be a string');
	  else {
	    if (schema.maxLength != null && instance.length > schema.maxLength)
	      errors.push('may have at most ' + schema.maxLength + ' characters');
	    if (schema.minLength != null && instance.length < schema.minLength)
	      errors.push('must have at least ' + schema.minLength + ' characters');
	    if (schema.pattern != null && !(RegExp(schema.pattern).test(instance)))
	      errors.push('must match ' + schema.pattern);
	  }

	  return fieldErrors(errors);
	};


	validator.array = function(schema, instance, context) {
	  var errors = [];
	  var result, i, j;

	  if (!Array.isArray(instance))
	    return fieldErrors(['must be an array']);
	  else {
	    if (schema.maxItems != null && instance.length > schema.maxItems)
	      errors.push('may have at most ' + schema.maxItems + ' items');
	    if (schema.minItems != null && instance.length < schema.minItems)
	      errors.push('must have at least ' + schema.minItems + ' items');
	    result = fieldErrors(errors);

	    if (schema.items != null) {
	      for (i in instance) {
	        errors = validate(schema.items, instance[i], context);
	        for (j in errors) {
	          result.push({
	            path  : [i].concat(errors[j].path),
	            errors: errors[j].errors
	          });
	        }
	      }
	    }
	  }

	  return result;
	};


	var requires = function(schema, key) {
	  var subschema;

	  if (schema.required != null && schema.required.indexOf(key) >= 0)
	    return 'must be present';
	  else {
	    subschema = schema.properties[key];
	    if (subschema.type == 'array' && subschema.minItems > 0)
	      return 'must have at least ' + subschema.minItems + ' items';
	    else
	      return null;
	  }
	};

	validator.object = function(schema, instance, context) {
	  var result = [];
	  var key, errors, i;

	  if (instance == null)
	    instance = {};

	  var alternativeSchema = alternative.schema(instance, schema, context);
	  schema = alternativeSchema || schema;

	  if (instance.constructor !== Object)
	    result.push({ path: [], errors: ['must be a plain object'] });
	  else {
	    for (key in schema.properties) {
	      if (instance.hasOwnProperty(key)) {
	        errors = validate(schema.properties[key], instance[key], context);
	        for (i = 0; i < errors.length; ++i)
	          result.push({
	            path  : [key].concat(errors[i].path),
	            errors: errors[i].errors
	          });
	      }
	      else if (requires(schema, key)) {
	        result.push({
	          path  : [key],
	          errors: [requires(schema, key)]
	        });
	      }
	    }
	  }

	  return result;
	};


	var cat = function(arrayOfArrays) {
	  return [].concat.apply([], arrayOfArrays);
	};


	var resolve = function(schema, context) {
	  var reference = schema['$ref'];

	  if (reference) {
	    if (!reference.match(/^#(\/([a-zA-Z_][a-zA-Z_0-9]*|[0-9]+))*$/))
	      throw new Error('reference '+reference+' has unsupported format');

	    return {
	      allOf: [
	        ou.without(schema, '$ref'),
	        ou.getIn(context, reference.split('/').slice(1))
	      ]
	    };
	  } else
	    return schema;
	};


	var validate = function (schema, instance, context) {
	  var effectiveContext = context || schema;
	  var effectiveSchema = resolve(schema, effectiveContext);

	  if (effectiveSchema.allOf) {
	    var results = [ou.without(effectiveSchema, 'allOf')]
	      .concat(effectiveSchema.allOf)
	      .map(function (schema) {
	        return validate(schema, instance, effectiveContext);
	      });
	    return cat(results);
	  } else if (effectiveSchema.anyOf) {
	    var _validateSchema = function (schema) {
	      return validate(schema, instance, effectiveContext);
	    };

	    var results = [ou.without(effectiveSchema, 'anyOf')].map(_validateSchema);
	    var resultsAnyOf = effectiveSchema.anyOf.map(_validateSchema);
	    if (cat(resultsAnyOf).length < effectiveSchema.anyOf.length) {
	      resultsAnyOf = [];
	    }
	    return cat(results.concat(resultsAnyOf));
	  } else {
	    var type = effectiveSchema.enum ? 'enum' : effectiveSchema.type;
	    if (type)
	      return validator[type](effectiveSchema, instance, effectiveContext);
	    else
	      return [];
	  }
	};

	module.exports = validate;


/***/ })
/******/ ])
});
;