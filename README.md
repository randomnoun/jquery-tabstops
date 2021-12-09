
## Overview

**jquery-tabstops** is a jquery plugin to provide Office-style tabstops, with various alignments and leaders.

Sort of like this:

![jquery-tabstops](https://raw.githubusercontent.com/randomnoun/jquery-tabstops/master/readme/stocks.png)

There's some more screenshots and sample fiddles below.

And a [blog post here](http://www.randomnoun.com/wp/2021/07/24/tabstop-me-if-you-think-that-youve-heard-this-one-before/).

## Quick start

Use [JSdelivr](https://www.jsdelivr.com/package/npm/jquery-tabstops) to get latest version of JQuery and the plugin.
```html
<!--jquery-->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.3.1"></script>

<!--jquery-tabstops javascript file-->
<script src="https://cdn.jsdelivr.net/npm/jquery-tabstops/js/jquery.tabstops.js"></script>   
``` 

## Install with NPM / Bower / Yarn

* [NPM](https://www.npmjs.com/package/jquery-tabstops) : npm install jquery-tabstops
* [Bower](https://bower.io/) : bower install jquery-tabstops
* [Yarn](https://yarnpkg.com/en/package/jquery-tabstops) : yarn add jquery-tabstops

## Sample screenshots

####  Table of contents
Example of right-alignment, leaders  
jsfiddle: [https://jsfiddle.net/knoxg/d8w6x07b/](https://jsfiddle.net/knoxg/d8w6x07b/)  
![Table of contents](https://raw.githubusercontent.com/randomnoun/jquery-tabstops/master/readme/toc.png)


#### Interesting mandelbrot co-ordinates
Example of different alignment options (decimal, center, left)  
jsfiddle: [https://jsfiddle.net/knoxg/c4wxb9ou/](https://jsfiddle.net/knoxg/c4wxb9ou/)  
( co-ordinates courtesy of [marksmath](https://www.marksmath.org/classes/DiscourseArchive/FractalLACFall2016/t/post-a-groovy-image-of-the-mandelbrot-set/73/) )  
![Interesting mandelbrot co-ordinates](https://raw.githubusercontent.com/randomnoun/jquery-tabstops/master/readme/mandelbrot.png)

#### Badly formatted stock table
Example of different leader options (blank, dotted, solid); different alignment options (left, decimal, right, center)  
jsfiddle: [https://jsfiddle.net/knoxg/03fg1ckd/](https://jsfiddle.net/knoxg/03fg1ckd/)  
![Stock list](https://raw.githubusercontent.com/randomnoun/jquery-tabstops/master/readme/stocks.png)

#### Badly formatted legal document
Example of bar alignment, custom leader  
jsfiddle: [https://jsfiddle.net/knoxg/4nbkxw5u/](https://jsfiddle.net/knoxg/4nbkxw5u/)  
![Legal](https://raw.githubusercontent.com/randomnoun/jquery-tabstops/master/readme/legal.png)

## Sample code

Some more jsfiddle examples of different use cases:

* [Default tab stops](https://jsfiddle.net/knoxg/z8p20cw9/)
* [Alignments (left, center, right, decimal, bar)](https://jsfiddle.net/knoxg/pm1fub0y/)
* [Leaders (blank, solid, dotted, dashed)](https://jsfiddle.net/knoxg/cs48pynb/)
* [Leader modes (text, border)](https://jsfiddle.net/knoxg/bj61m0fr/)
* [Configure via style, data, class, or javascript](https://jsfiddle.net/knoxg/yh61wur7/)

## Initialisation

The plugin formats text surrounding tabs so that they align with tabstops defined as options to the plugin, or as CSS styles.
```html
<p>Some example</p>
```

To initialise the plugin, call tabstops() on the element:
```javascript
$("p").tabstops();
```


## Settings

Most users will probably only use the 'tabstops' and 'deafultTabstop' options.

All measurements can be expressed in CSS units ( e.g. 1cm, 10px, 1in, 1em, 10%, 0.1vw )

| Option | Data-Attr | Defaults | Type | Description |
| --- | --- | --- | --- | --- |
| `tabstops` | `data-tabstops` | | tab stops | Set the tab stops for a paragraph |
| `defaultTabstop` | `data-default-tabstop` | `96px`| tab stop | Set the default tab stops for a paragraph. 96px is an inch at 96DPI ( the default for Office applications ) |
| `tabstopsCssProperty` |  | `--tabstops` | string | The CSS property used to hold tabstops for the plugin |
| `tabElement` | `data-tab-element` | `span` | string | The HTML element used to represent tabs |
| `tabClass` | `data-tab-class` | `tab` | string | The HTML class used to represents tabs |
| `convertTabs` | `data-convert-tabs` | `true` | boolean | Convert tab characters ( \t ) to HTML elements. If false, then tabs must already be represented as the elements and classes configured in the `tabElement` and  `tabClass` options |
| `scale` | | `1` | number | Adjust tabstop scale |
| `leaderMode` | `data-leader-mode` | `text` | string | Sets the leader mode (either `text` or `border`) |
| `refreshOnResize` | | `true` | boolean | If true will reformat tabs after container is resized |


## Creating tabstops

Tabstops can be created via CSS classes, inline styles, data sttributes or javascript.


CSS classes:
```html
<style>
.myTabStyle {
  --tabstops: 1cm left, 5cm right dotted, 10cm center;
}
</style>
<p class="myTabStyle">Here be the tabstops</p>
<script>
    $("p").tabstops();
</script>
```

Inline CSS:
```html
<p style="--tabstops: 1cm left, 5cm right dotted, 10cm center">Here be the tabstops</p>
<script>
    $("p").tabstops();
</script>
```

Data attributes:
```html
<p data-tabstops="1cm left, 5cm right dotted, 10cm center">Here be the tabstops</p>
<script>
    $("p").tabstops();
</script>
```

Javascript:
```html
<p data-tabstops="1cm left, 5cm right dotted, 10cm center">Here be the tabstops</p>
<script>
    $("p").tabstops(
        tabstops: '1cm left, 5cm right dotted, 10cm center', // three manual tabstops
    });
</script>
```

When initialising by javascript, tabstops can be supplied using a comma-separated list of tabstops (as above), or by an array of individual tabstops. 

Individual tabstops can be represented either as strings:
```html
<p data-tabstops="1cm left, 5cm right dotted, 10cm center">Here be the tabstops</p>
<script>
    $("p").tabstops(
        tabstops: [ 
          '1cm left', 
          '5cm right dotted', 
          '10cm center'
        ]
    });
</script>
```

or objects:
```html
<p data-tabstops="1cm left, 5cm right dotted, 10cm center">Here be the tabstops</p>
<script>
    $("p").tabstops(
        tabstops: [ 
          { position : '1cm', align: 'left' },
          { position : '5cm', align: 'right', leader: 'dotted' }, 
          { position : '10cm', align: 'center }
        ]
    });
</script>
```
## Events
Tabstops do not generate events

## Methods

```javascript
// initialise tabstops 
// is equivalent to .tabstops('refresh')
$('p').tabstops();

// refresh tabstops
// e.g. after container resize has triggered wordwrap
$('p').tabstops('refresh');

// set multiple options and refresh
$('p').tabstops('refresh', { 
  'defaultTabstop' : '2cm',
  'leaderMode' : 'border'
});

// reset options after data attribute modification
$('p').attr('data-default-tabstop', '2cm');
$('p').tabstops('refresh', 'data');

// reset tabstops from CSS after CSS style / class modifications
$('p').attr('class', 'myDifferentTabstopStyle');
$('p').tabstops('refresh', { tabstops : null } );


// OPTIONS

// retrieve all options
var options = $('#myParagraph').tabstops('option');
console.log(options);

// retrieve individual option
var defaultTabstop = $('#myParagraph').tabstops('option', 'defaultTabstop');
console.log(defaultTabstop);

// change individual options and refresh
$('p').tabstops('option', 'defaultTabstop', '2cm');
$('p').tabstops('refresh');

// change multiple options and refresh
$('p').tabstops('option', { 
  'defaultTabstop' : '2cm',
  'leaderMode' : 'border'
});
$('p').tabstops('refresh');

// destroy tabstops
// will also reverse any conversions made if `convertTabs` property 
// was true during initialisation
$('p').tabstops('destroy');
```

## Dependencies

* <a href="http://jquery.com/" target="_blank">jQuery 1.8.x+</a>


## Usage

Add the following libraries to the page:
* jQuery
* jquery-tabstops.min.js

## Licensing

jquery-tabstops is licensed under the BSD 2-clause license.
