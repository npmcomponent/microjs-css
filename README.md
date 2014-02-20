*This repository is a mirror of the [component](http://component.io) module [microjs/css](http://github.com/microjs/css). It has been modified to work with NPM+Browserify. You can install it using the command `npm install npmcomponent/microjs-css`. Please do not open issues or send pull requests against this repo. If you have issues with this repo, report it to [npmcomponent](https://github.com/airportyh/npmcomponent).*
[![Build Status](https://secure.travis-ci.org/microjs/css.png?branch=master)](https://travis-ci.org/microjs/css)
# css

  JavaScript dynamic stylesheets

## Installation

    $ component install microjs/css

## Usage

  Basic usage.

```javascript
var css = require('css');

var sheet = css.newSheet();
sheet
  .selector('div.test', {
    'float': 'left',
    'border': '1px solid #000'
  })
  .selector('span', {
    'font-style': 'italic'
  });
```      
  
  Selectors can be used later.

```javascript
var div_css = sheet.selector('div.test');

div_css.properties({
  'background': 'pink'
});
```
    
  Remove selector properties.
  
```javascript
sheet.remove('div.test');
sheet.remove(div_css);
```
    
  Remove sheet.
  
```javascript
sheet.remove();
```

## License

  MIT