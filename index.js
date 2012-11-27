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
  extend(this.props, properties);
  this.refresh();
  return this;
};

Selector.prototype.refresh = function() {
  var props = this.props;
  var parts = [];
  for (var name in props) {
    if (props.hasOwnProperty(name)) {
      parts.push(name + ":" + props[name]);
    }
  }
  this.node.nodeValue = this.name + " { " + (parts.join(';')) + "; }";
};

Selector.prototype.getNode = function() {
  return this.node;
};

Selector.prototype.selector = function(name, properties) {
  return this.sheet.selector(name, properties);
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
    this.node.appendChild(selector.getNode());
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
  if (typeof selector === 'string' && this.selector[selector]) {
    this.node.removeChild(this.selectors[selector].getNode());
    delete this.selectors[selector];
  }
  if (typeof selector === 'object') {
    this.node.removeChild(selector.getNode());
    delete this.selectors[selector.getName()];
  }
  return this;
};

module.exports = {
  newSheet: function() {
    return new Sheet();
  }
};
