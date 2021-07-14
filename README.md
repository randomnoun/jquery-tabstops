![jquery-tabstops](_tmp/logo-jquery-tabstops.png)

## Overview

**jquery-tabstops** is a jquery plugin to provide Office-style tabstops, with various alignments and leaders

Screenshot:

![jquery-tabstops](_tmp/jquery-tabstops.png)

Blog post:

[link to that]

## Quick start

Use [CDNjs](https://cdnjs.com/libraries/jquery-tabstops) or [JSdelivr](https://www.jsdelivr.com/package/npm/jquery-tabstops) to get latest version of JQuery and the plugin.
```html
<!--jquery-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

<!--jquery-tabstops javascript file-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-tabstops/0.0.1/js/jquery-tabstops.min.js"></script>   
``` 

## Install with NPM / Bower / Yarn

* [NPM](https://www.npmjs.com/package/jquery-tabstops) : npm install jquery-tabstops
* [Bower](https://bower.io/) : bower install jquery-tabstops
* [Yarn](https://yarnpkg.com/en/package/jquery-tabstops) : yarn add jquery-tabstops

## Demos

* <a href="http://thegithubsite/jquery-tabstops/demo.html" class="switch__item">Basic demo</a>
* <a href="http://thegithubsite/jquery-tabstops/demo_advanced.html" class="switch__item">Advanced demo</a>
* <a href="http://thegithubsite/jquery-tabstops/demo_interactions.html" class="switch__item">Interactions demo</a>


## Initialisation

The plugin formats text surrounding tabs so that they align with tabstops defined as options to the plugin, or as CSS styles.
```html
<p>Some example</p>
```

To initialise the plugin, call tabstops() on the element:
```javascript
$("p").tabstops();
```


## Examples

Here you can find bunch of advanced jsfiddle demos with different use cases:

* [Default tab stops](https://jsfiddle.net/knoxg/Lzxpkfea/)
* [Alignments (left, center, right, decimal, bar)](https://jsfiddle.net/knoxg/Lzxpkfea/)
* [Leaders (blank, solid, dotted, dashed)](https://jsfiddle.net/knoxg/Lzxpkfea/)
* [Leader modes (text, border)](https://jsfiddle.net/knoxg/Lzxpkfea/)
* [Configure via CSS classes](https://jsfiddle.net/knoxg/Lzxpkfea/) (recommended)
* [Configure via CSS element styles](https://jsfiddle.net/knoxg/Lzxpkfea/)
* [Configure via javascript](https://jsfiddle.net/knoxg/Lzxpkfea/)
* [Changing options via javascript](https://jsfiddle.net/knoxg/Lzxpkfea/)


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

Either by creating a CSS class
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
Or by inlining the CSS
```html
<p style="--tabstops: 1cm left, 5cm right dotted, 10cm center">Here be the tabstops</p>
<script>
    $("p").tabstops();
</script>
```
Or by using data attributes
```html
<p data-tabstops="1cm left, 5cm right dotted, 10cm center">Here be the tabstops</p>
<script>
    $("p").tabstops();
</script>
```
Or by using javascript
```html
<p data-tabstops="1cm left, 5cm right dotted, 10cm center">Here be the tabstops</p>
<script>
    $("p").tabstops(
        tabstops: '1cm left, 5cm right dotted, 10cm center', // three manual tabstops
    });
</script>
```
When initialising by javascript, tabstops can be supplied using a comma-separated list of tabstops (as above), or by an array of individual tabstops. Individual tabstops can be represented either as strings:
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
Tabstops generate no events

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

// set options via data attributes
$('p').attr('data-default-tabstop', '2cm');
$('p').tabstops('refresh', 'data');

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