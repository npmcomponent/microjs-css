var document = {};
exports.head = [];

var elementChildren = [];
exports.getChildren = function (parent) {
  for (var i = 0; i < elementChildren.length; i++) {
    if (elementChildren[i][0] === parent) {
      return elementChildren[i][1];
    }
  }
};

exports.TextNode = TextNode;
function TextNode(text) {
  this.nodeValue = text;
}
document.createTextNode = function (text) {
  return new TextNode(text);
};

exports.StyleElement = StyleElement;
function StyleElement() {
  var children = [this, []];
  elementChildren.push(children);
  this.type = '';
  this.appendChild = function (node) {
    node.parentNode = this;
    children[1].push(node);
  };
  this.removeChild = function (node) {
    children[1] = children[1]
      .filter(function (n) {
        return n != node;
      });
  };
}

document.createElement = function (type) {
  if (type === 'style') {
    return new StyleElement();
  }
  throw new Error('Un-recognised type: ' + type);
};

document.head = {};
document.head.appendChild = function (child) {
  child.parentNode = document.head;
  exports.head.push(child);
};
document.head.removeChild = function (child) {
  exports.head = exports.head
    .filter(function (node) {
      return node != child;
    });
};

global.document = document;