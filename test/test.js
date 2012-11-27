var expect = require('expect.js');
var bunker = require('bunker');
var doc = require('./document-mock');

var b = bunker(require('fs').readFileSync(require('path').join(__dirname, '../index.js')).toString());

var linesCovered = {};
b.on('node', function (node, stack) {
  linesCovered[node.start.line] = true;
  linesCovered[node.end.line] = true;
});

var cssModule = {exports: {}};
b.run({module: cssModule, exports: cssModule.exports, document: document});
var css = cssModule.exports;

//var css = require('..');
 
describe('A new sheet', function () {
  var sheet;
  it('can be created and will be added to the head', function () {
    sheet = css.newSheet();
    expect(doc.head[0]).to.be.a(doc.StyleElement);
    expect(doc.head[0].type).to.be('text/css');
    expect(doc.getChildren(doc.head[0]).length).to.be(0);
  });

  describe('`sheet.selector(name, properties)`', function () {
    describe('when there isn\'t yet a selector with that name in the sheet', function () {
      it('creates a new text-node for the selector', function () {
        sheet = sheet.selector('div.test', {
          'float': 'left',
          'border': '1px solid #000'
        });
        var sheetChildren = doc.getChildren(doc.head[0]);
        expect(sheetChildren.length).to.be(1);
        expect(sheetChildren[0]).to.be.a(doc.TextNode);
        expect(sheetChildren[0].nodeValue).to
          .be('div.test { float:left;border:1px solid #000; }');
      });
    });
    describe('when there\'s already a selector with that name in the sheet', function () {
      it('creates a new text-node for the selector', function () {
        sheet = sheet.selector('div.test', {
          'float': 'right',
          'border': '2px solid #000'
        });
        var sheetChildren = doc.getChildren(doc.head[0]);
        expect(sheetChildren.length).to.be(1);
        expect(sheetChildren[0]).to.be.a(doc.TextNode);
        expect(sheetChildren[0].nodeValue).to
          .be('div.test { float:right;border:2px solid #000; }');
      });
    });
    describe('chaining', function () {
      it('can be chained', function () {
        sheet.selector('span', {
          'font-style': 'italic'
        });
        var sheetChildren = doc.getChildren(doc.head[0]);
        expect(sheetChildren.length).to.be(2);
        expect(sheetChildren[1]).to.be.a(doc.TextNode);
        expect(sheetChildren[1].nodeValue).to
          .be('span { font-style:italic; }');
      });
    });
  });
  describe('`sheet.selector(name)`', function () {
    var selector;
    it('returns the selector with that name', function () {
      selector = sheet.selector('div.test');
    });
    describe('`selector.getName()`', function () {
      it('returns the selector text', function () {
        expect(selector.getName()).to.equal('div.test');
      });
    });
    describe('`selector.properties(properties)`', function () {
      it('updates the properties on the existing object', function () {
        selector.properties({
          'float': 'none'
        });
        expect(doc.getChildren(doc.head[0])[0].nodeValue).to
          .be('div.test { float:none;border:2px solid #000; }');
      });
    });
    describe('`selector.properties()`', function () {
      it('returns the current properties on the object', function () {
        var props = selector.properties();
        expect(props).to
          .eql({'float':'none', 'border':'2px solid #000'});
      });
    });
    describe('`selector.remove()`', function () {
      it('removes the node from the document', function () {
        selector.remove();
        var sheetChildren = doc.getChildren(doc.head[0]);
        expect(sheetChildren.length).to.be(1);
        expect(sheetChildren[0]).to.be.a(doc.TextNode);
        expect(sheetChildren[0].nodeValue).to
          .be('span { font-style:italic; }');
      });
    });
  });
  describe('`sheet.remove(selectorName)`', function () {
    it('removes the node from the document', function () {
      sheet.remove('span');
      expect(doc.getChildren(doc.head[0]).length).to.be(0);
    });
  });
  describe('`sheet.remove()`', function () {
    it('removes the entire sheet from the document', function () {
      sheet.remove();
      expect(doc.head.length).to.be(0);
    });
  });
});

function make(text, colour) {
  var reset = '\u001b[0m';
  var prefix = {
    red: '\u001b[31m',
    blue: '\u001b[34m'
  }
  return (prefix[colour] || reset) + text + reset;
}

describe('test coverage', function () {
  it('is covered', function () {
    var testPasses = true;
    var coverageOutput = [];
    var testFile = require('fs').readFileSync(require('path').join(__dirname, '../index.js')).toString();
    var code = testFile.split('\n');
    var inComment;
    for (var i = 0; i < code.length; i++) {
      var covered = linesCovered[i]
                    || code[i].trim() == ''
                    || code[i].trim() == '}'
                    || code[i].trim() == '};'
                    || /^function/.test(code[i].trim())
                    || /^if \([^\)\{]+\) \{/.test(code[i].trim())
                    || /^\} *else *\{$/.test(code[i].trim())
                    || /^for[^\{]*\{$/.test(code[i].trim())
                    || /^[^\{]+\:/.test(code[i]);
      if (/^\/\*/.test(code[i].trim())) inComment = true;
      if (inComment) covered = true;
      if (/\*\//.test(code[i])) inComment = false;
      testPasses = testPasses && covered;
      coverageOutput.push(make(code[i], (covered ? 'white':'red')));
    };
    
    if (!testPasses) {
      console.log('\n');
      coverageOutput.forEach(function (line) {
        console.log(line);
      });
      console.log('\n');
    }
    expect(testPasses).to.be.ok();
  });
})