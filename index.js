/*
  css.js - Dynamic stylesheets 

  https://github.com/radmen/css.js
  Copyright (c) 2012 Radoslaw Mejer <radmen@gmail.com>
*/

function extend(extendedVar, object) {
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      extendedVar[key] = object[key];
    }
  }
};

function Selector(name, sheet) {
  this.name = name;
  this.sheet = sheet;
  this.props = {};
  this.node = document.createTextNode('');
}

Selector.prototype.getName = function() {
  return this.name;
};

Selector.prototype.properties = function(properties) {
  if (!properties) {
    return this.props;
  }
  extend(this.props, properties);
  var parts = [];
  for (var name in this.props) {
    if (this.props.hasOwnProperty(name)) {
      parts.push(name + ":" + this.props[name]);
    }
  }
  this.node.nodeValue = this.name + " { " + (parts.join(';')) + "; }";
  return this;
};

Selector.prototype.remove = function() {
  return this.sheet.remove(this);
};

function Sheet() {
  this.node = document.createElement('style');
  this.node.type = 'text/css';
  this.selectors = {};
  document.head.appendChild(this.node);
}

Sheet.prototype.selector = function(name, properties) {
  var selector;
  if (!this.selectors[name]) {
    selector = this.selectors[name] = new Selector(name, this);
    this.node.appendChild(selector.node);
  } else {
    selector = this.selectors[name];
  }
  if (properties) {
    selector.properties(properties);
    return this;
  }
  return selector;
};

Sheet.prototype.remove = function(selector) {
  if (!selector) {
    this.node.parentNode.removeChild(this.node);
    delete this.properties;
    return null;
  }
  if (typeof selector === 'string' && this.selectors[selector]) {
    this.node.removeChild(this.selectors[selector].node);
    delete this.selectors[selector];
  }
  if (typeof selector === 'object') {
    this.node.removeChild(selector.node);
    delete this.selectors[selector.getName()];
  }
  return this;
};

module.exports = {
  newSheet: function() {
    return new Sheet();
  }
};
