var doc = require('./document-mock');
var expect = require('expect.js');

var css = require('..');

describe('A new sheet', function () {
  var sheet;
  it('can be created and will be added to the head', function () {
    sheet = css.newSheet();
    expect(doc.head[0]).to.be.a(doc.StyleElement);
    expect(doc.head[0].type).to.be('text/css');
    expect(doc.getChildren(doc.head[0]).length).to.be(0);
  });

  var selector;
  describe('Adding a selector', function () {
    it('creates a new text-node for the selector', function () {
      selector = sheet.selector('div.test', {
        'float': 'left',
        'border': '1px solid #000'
      });
      var sheetChildren = doc.getChildren(doc.head[0]);
      expect(sheetChildren.length).to.be(1);
      expect(sheetChildren[0]).to.be.a(doc.TextNode);
      expect(sheetChildren[0].nodeValue).to.be('div.test { float:left;border:1px solid #000; }');
    });
    it('can be chained', function () {
      selector.selector('span', {
        'font-style': 'italic'
      });
      var sheetChildren = doc.getChildren(doc.head[0]);
      expect(sheetChildren.length).to.be(2);
      expect(sheetChildren[1]).to.be.a(doc.TextNode);
      expect(sheetChildren[1].nodeValue).to.be('span { font-style:italic; }');
    });
  });
});