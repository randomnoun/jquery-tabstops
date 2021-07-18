/** tabstop jquery extensions
 * Site: the github site once that exists
 * Author: Greg Knox <knoxg+npm@randomnoun.com>
 *
 * This javascript module exports the following:
 *
 * $.tabstops( verb, options )
 *
 * Where the default verb is 'refresh'.
 *
 * Known verbs:
 * 'refresh' : format tab characters to user-defined tabstops 
 * 'option' : get or set options
 * 'destroy' : revert tab formatting
 *
 * Options can be set via CSS classes, inline styles, data attributes or javascript.
 *
 * Default javascript options are:
 *   'tabElement' : 'span',
 *   'tabClass' : 'tab',
 *   'tabstopsCssProperty' : '--tabstops', 
 *   'convertTabs' : true,
 *   'tabstops' : null,
 *   'defaultTabstop' : '96px', // default tabs are 1 inch in powerpoint ( = 2.54 cm,  = 96 px )
 *   'scale' : 1, // might be useful for tabs in SVG foreignObjects
 *   'leaderMode' : 'text',
 *   'refreshOnResize' : true
 *
 */
(function($) {

    $.fn.extend({
        tabstops: function(verb, p1, p2) {
            if (typeof verb == 'undefined') {
                verb = 'refresh';
            } else if (typeof verb == 'object') { 
                p1 = verb; verb = 'refresh';
            }
            this.each(function() {
                new $.Tabstops(this, verb, p1, p2);
            });
            return this;
        }
    });


    $.Tabstops = function( el, verb, p1, p2 ) {
        var $el = $(el);
    
        if (verb=='refresh') {
            refresh($el, p1);
            
        } else if (verb=='option') {
            option($el, p1, p2);

        } else if (verb=='destroy') {
            var data = $el.data('tabstops');
            if (data) {
                resetTabs($el, data.tabElement, data.tabClass, false, true);
                $el.data('tabstops', null);
            }
        }
    };

    // option defaults
    $.Tabstops.defaults = {
        'refresh' : {
            'tabElement' : 'span',
            'tabClass' : 'tab',
            'tabstopsCssProperty' : '--tabstops', 
            'convertTabs' : true,
            'tabstops' : null,
            'defaultTabstop' : '96px', // default tabs are 1 inch in powerpoint ( = 2.54 cm,  = 96 px )
            'scale' : 1, // might be useful for tabs in SVG foreignObjects
            'leaderMode' : 'text',
            'refreshOnResize' : true
        }
    }    


    function refresh($el, _options) {
        var cssToPixel = function(target, value) {
            // @TODO if value is already px just return that
            var temp = document.createElement("div");  // create temporary element
            temp.style.overflow = "hidden";  // in case baseline is set too low
            temp.style.visibility = "hidden";  // no need to show it
            target.parentNode.appendChild(temp);    // insert it into the parent for em and ex  
            temp.style.width = value;
            var result = temp.offsetWidth; // assumes px = 1
            target.parentNode.removeChild(temp);  // clean up
            return result;
        } 
        
        // options are:
        // . base defaults
        // . overridden by data attributes        
        // . overridden by previously-defined options    
        // . overriden by new javascript options

        // @TODO class -> style -> data -> js
        var p = $el[0];
        var dataAttributes = {};
        for (var a of [ 'tabstops', 'default-tabstop', 'tab-element', 'tab-class', 'convert-tabs', 'leader-mode' ]) {
            var v = p.getAttribute('data-' + a);
            if (v!=null) {
                var camelA = a.replace(/-([a-z])/g, function(m) { return m[1].toUpperCase(); });
                dataAttributes[camelA] = v;
            }
        }
        if (_options == 'data') { _options = dataAttributes; }

        var options = $.extend( {}, $.Tabstops.defaults['refresh'], dataAttributes, $el.data('tabstops'), _options);
        
        var tabstopsCssProperty = options.tabstopsCssProperty;
        var defaultTabstop = options.defaultTabstop;
        var refreshOnResize = options.refreshOnResize;
        var tabstops = [];
        var tabstopsRaw = [];
        
        if (options.tabstops == null) {
            // we can create custom css properties if they start with '--'
            // see https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties#values_in_javascript
            var tabstopsRaw = p.style.getPropertyValue(tabstopsCssProperty) ||    // css on element 
              getComputedStyle(p).getPropertyValue(tabstopsCssProperty);          // css on class
            tabstopsRaw = tabstopsRaw.trim().split(/,/);
        } else if (Array.isArray(options.tabstops)) {
            tabstopsRaw = options.tabstops;
        } else if (typeof options.tabstops == 'string') {
            tabstopsRaw = options.tabstops.trim().split(/,/);
        } else {
            throw 'Unexpected options.tabstops; expected string or array, found ' + ( typeof options.tabstops );
        }
        if (tabstopsRaw.length == 1 && tabstopsRaw[0] == '') { 
            tabstopsRaw = [];
        }
        for (var i=0; i<tabstopsRaw.length; i++) {
            var raw = tabstopsRaw[i];
            if (typeof raw == 'string') {
                // var pal = raw.trim().split(/\s+/); // position, align, leader
                var pal = raw.trim().match(/[^\s"']+|"([^"]*)"|'([^']*)'/g); // split on whitespace, apart from whitespace in quotes
                var pos = pal[0];
                var posPx = cssToPixel(p, pos);    
                var ts = { position : pos , pos : posPx, align : 'left' };
                if ( pal.length > 1 ) { ts.align = pal[1]; }
                if ( pal.length > 2 ) { ts.leader = pal[2]; }
                // if the alignment looks like a leader then swap them
                if ( ts.align == 'dotted' ||  ts.align == 'dashed' || ts.align == 'solid' || ts.align == 'blank') {
                    var v = ts.align; ts.align = ts.leader; ts.leader = v;
                }
                if ( !ts.align ) { ts.align = 'left'; }
                if ( !ts.leader ) { ts.leader = 'blank'; }
                // if the alignment is 'bar' this isn't really a tabstop
                tabstops.push(ts);
            } else if (typeof raw == 'object') {
                // convert positions to pixels
                tabstops.push(
                   $.extend( {}, raw, { pos : cssToPixel(p, raw.position) } ) 
                );
            } else {
                throw 'Unexpected options.tabstops element; expected string or array';
            }
        }
        
        defaultTabstop = cssToPixel(p, defaultTabstop);
        var data = {
            tabstops : tabstops,
            defaultTabstop : defaultTabstop,
            tabElement : options.tabElement,
            tabClass : options.tabClass,
            convertTabs : options.convertTabs,
            scale : options.scale,
            leaderMode : options.leaderMode
            
        };
        $el.data('tabstops', data); // necessary ?
        _refresh($el, data);
        
        if (refreshOnResize) {
            $el.on('resize', function(e) {
                _refresh($el, data);
            });
        }
    }

    
    // createTabElements = true: convert \t to spans
    // destroyTabElements = true: convert spans to \ts, but only the ones we created before
    function resetTabs($el, tabElement, tabClass, createTabElements, destroyTabElements) {
        // $el should be a single element by the time this runs. I think. probably.
        // could make this more restrictive but contenteditable editors might move them around a bit. OR WILL THEY.
        // do we really want to recreate these things on each keystroke ? seems a bit painful. will do for now.
        $('svg[data-tabstops]', $el).remove(); 
        
        var tabSelector = tabElement + '.' + tabClass;
        var spanTabs = $(tabSelector, $el);
        
        // reset styles
        spanTabs.css('display', 'inline'); // remove widths
        spanTabs.css('width', ''); 
        spanTabs.css('minWidth', ''); 
        spanTabs.css('margin', ''); 
        spanTabs.css('borderBottom', ''); 
        spanTabs.css('textAlign', ''); 
        spanTabs.empty();
        
        if (destroyTabElements) {
            spanTabs.each(function (i, e) {
                if (e.tabstopsCreated) { 
                    var prevNode = e.previousSibling;
                    var nextNode = e.nextSibling;
                    if (prevNode && prevNode.nodeType == Node.TEXT_NODE &&
                        nextNode && nextNode.nodeType == Node.TEXT_NODE) {
                        nextNode.nodeValue = prevNode.nodeValue + '\t' + nextNode.nodeValue;
                        prevNode.parentNode.removeChild(prevNode);
                    } else if (prevNode && prevNode.nodeType == Node.TEXT_NODE) {
                        prevNode.nodeValue = prevNode.nodeValue + '\t';
                    } else if (nextNode && nextNode.nodeType == Node.TEXT_NODE) {
                        nextNode.nodeValue = '\t' + nextNode.nodeValue;
                    } else {
                        // @TODO construct a new text node
                    }
                    e.parentNode.removeChild(e);
                }
            });
        }
        
        // convert tab characters to tabSelectors
        // get all text nodes ( https://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery )
        function getTextNodesIn(node, includeWhitespaceNodes) {
            var textNodes = [], nonWhitespaceMatcher = /\S/;
            function getTextNodes(node) {
                if (node.nodeType == Node.TEXT_NODE) {
                    if (includeWhitespaceNodes || nonWhitespaceMatcher.test(node.nodeValue)) {
                        textNodes.push(node);
                    }
                } else {
                    for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                        getTextNodes(node.childNodes[i]);
                    }
                }
            }
            getTextNodes(node);
            return textNodes;
        }

        if (createTabElements) {
            var newSpanTabs = false;        
            $($el).each(function(i, el) { 
                $.each(getTextNodesIn(el, true), function(j, node) {
                    var t = node.nodeValue;
                    var pos = t.indexOf('\t'); // @TODO other unicode tab characters. like that's going to happen
                    while (pos !=-1 ) {
                        // n.nodeValue = n.nodeValue.replaceAll('\t', '<span class="tab"></span>'); // ah crap.
                        // add two nodes here, a span and the text after the span (if there is any); return the span
                        newSpanTabs = true;
                        var beforeTabTextNode = node.parentNode.insertBefore(document.createTextNode(t.substring(0, pos)), node);
                        var tabSpanNode = node.parentNode.insertBefore(document.createElement(tabElement), node);
                        tabSpanNode.setAttribute('class', tabClass);
                        tabSpanNode.tabstopsCreated = true; // so we can destroy it again later
                        node.nodeValue = t.substring(pos + 1);
                        t = node.nodeValue;
                        pos = t.indexOf('\t');
                    }
                })
            });
            if (newSpanTabs) {
                spanTabs = $(tabSelector, $el);
            }
        }
        
        return spanTabs;
    }
    
    // based on how jquery-ui does things
    // $(e).tabstop('option') - returns all options
    // $(e).tabstop('option', 'key') - returns single option
    // $(e).tabstop('option', object ) - update multiple options
    // $(e).tabstop('option', 'key', 'value' ) - update single option
    function option($el, p1, p2) {
       
        if (typeof p1 == 'undefined') {
            // no params, return all options
            return $el.data('tabstops');
        } else if (typeof p1 == 'string') {
            if (typeof p2 == 'undefined') {
                // 1 string parameter, return that option
                return $el.data('tabstops') ? $el.data('tabstops')[p1] : null;
            } else {
                // 2 parameters, first is a string, set that option
                $el.data('tabstops')[p1] = p2;
            }
         } else if (typeof p1 == 'object') {
            // first parameter is object, update options
            var options = $el.data('tabstops');
            if (options) { 
                $el.data('tabstops', $.extend(options, p2)); 
            }
        }
    }
    
    // the 'real' refresh method, after options have been parsed and converted into px
    
    function _refresh($el, data) {
        var p = $el[0];
        var tabstops = data.tabstops;
        var defaultTabstop = data.defaultTabstop;
        var tabElement = data.tabElement;
        var tabClass = data.tabClass;
        var convertTabs = data.convertTabs;
        var scale = data.scale;
        var leaderMode = data.leaderMode;
        
        // p.offset here is returning post-scaled offset
        // but the width value we're assigning to the <span> is a pre-scaled width
        var pOffset = $(p).offset();
        var pLeft = pOffset.left / scale; 
        var pWidth = $(p).width();
        var pHeight = null; 
        
        var spanTabs = resetTabs(p, tabElement, tabClass, convertTabs, false);  // 'span.tab'
        tabElement = tabElement.toUpperCase();
        
        function makeSvgNode(tag, attrs) {
            var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var k in attrs) {
                el.setAttribute(k, attrs[k]);
            }
            return el;
        }
        
        // draw bars
        $.each( data.tabstops, function ( i, bar ) {
            if (bar.align == 'bar') {
                // hide if bar.pos > pWidth ? 
                pHeight = pHeight == null ? $(p).height() : pHeight;
                var svgHeight = pHeight + parseInt($(p).css('margin-bottom')); // hmm
                var svgNode = makeSvgNode('svg', { 
                    style: 'position:absolute;', 
                    viewBox: '0 0 ' + (bar.pos + 1) + ' ' + (svgHeight), 
                    width: (bar.pos + 1) + 'px', 
                    height: (svgHeight) + 'px', 
                    'data-tabstops': 'bar'
                });
                svgNode.appendChild(makeSvgNode('path', { 
                    d: 'M' + bar.pos + ',0 v ' + svgHeight + '',
                    stroke: '#000'
                })); // @TODO scale ?
                svgNode.tabstopsCreated = true;
                var svgEl = $(p).prepend(svgNode); 
                // svgEl.data() doesn't survive; using attributes instead
                // position it at the start of the P. maybe. might be better to put the var offset here ?
                svgEl.offset( { 'top': pOffset.top, 'left': pOffset.left }); 
            }
        });
        
        spanTabs.each(function (j, spanTab) {
            var spanLeft = $(spanTab).offset().left / scale - pLeft;
            var nextTabstop = null;
            for (var k = 0; k < tabstops.length; k++) {
                if (tabstops[k].pos > spanLeft && tabstops[k].align != 'bar') { 
                    nextTabstop = tabstops[k]; 
                    break; 
                }
            }
            if (!nextTabstop) {
                // next default tabstop ( always left-aligned, no leader )
                var dt = (Math.floor(spanLeft / defaultTabstop) + 1) * defaultTabstop;
                if (dt < pWidth) {
                    nextTabstop = { pos: dt, align: 'left' };
                }
            }
            if (nextTabstop) {
                // tabs that are formatted in the original pptx may have underlines applied to them (to simulate tab leaders)
                // that we want to convert to border styles when we convert to a inline-block
                // ( HTML will only underline text within a span, not the entire span width )
                // we can't get the underline style off the tab element itself, but we can from the containing span with the runProperties css
                var align = nextTabstop.align;
                var leader = nextTabstop.leader; 
                var tdl = getComputedStyle(spanTabs[0].parentNode).textDecorationLine;  // underline
                var tds = getComputedStyle(spanTabs[0].parentNode).textDecorationStyle; // dotted, dash, solid
                var tdc = getComputedStyle(spanTabs[0].parentNode).textDecorationColor; // rgb(0, 0, 0)
                if (tdl == 'underline') {
                    leader = tds;
                }
                
                // decimal alignment becomes right alignment if there's no decimal
                var decimalSpanNode = null
                if (align=='decimal') {
                    // this will become more complicated if we need to handle text that contains a linebreak
                    $(spanTab).css('display', 'inline-block');
                  
                    // insert a span just before the decimal point ( the '.123' text appears after the tabstop pos)
                    function addPointSpanAfter(node) {
                        while (node != null) {
                            if (node.nodeType == Node.TEXT_NODE) { 
                                var t = node.nodeValue;
                                var pos = t.indexOf('.'); // @TODO other unicode decimal characters. like that's going to happen
                                if (pos != -1) {
                                    // add two nodes here, a span and the text after the span (if there is any); return the span
                                    var beforePointTextNode = node.parentNode.insertBefore(document.createTextNode(t.substring(0, pos)), node);
                                    var decimalSpanNode = node.parentNode.insertBefore(document.createElement('SPAN'), node);
                                    node.nodeValue = t.substring(pos);
                                    return decimalSpanNode;
                                }
                            } else if (node.nodeType == Node.ELEMENT_NODE) { 
                                // if ($(node).is(tabSelector)) {
                                if (node.tagName == tabElement && node.classList.contains(tabClass)) {
                                    return null; // reached the next tab, abort recursion
                                }
                                if (node.firstChild != null) { // recurse into children
                                    var apsa = addPointSpanAfter(node.firstChild); 
                                    if (typeof apsa != 'undefined') { return apsa; }
                                }
                            } else {
                                // ignore
                            }
                            node = node.nextSibling;
                        }
                        return undefined;  // continue to next element
                    }
                    // could check if textContent contains a '.' to skip this
                    decimalSpanNode = addPointSpanAfter(spanTab.nextSibling);
                    if (typeof decimalSpanNode == 'undefined' || decimalSpanNode == null) {
                        align = 'right';
                    }
                }
                
                if (align=='left' || align=='start') {
                    spanTabWidth = (nextTabstop.pos - spanLeft);
                  
                } else if (align=='right' || align=='end') {
                    // this will become more complicated if we need to handle text that contains a linebreak
                    $(spanTab).css('display', 'inline-block');
                  
                    // calc width of text to the next tab. if there isn't one add a temp one to the end of the P
                    if (j + 1 < spanTabs.length) {
                        var nextTab = spanTabs[j+1];
                        textWidth = $(nextTab).offset().left / scale - pLeft - spanLeft;
                    } else {
                        var temp = document.createElement("span");  // create temporary element
                        temp.style.overflow = "hidden";    
                        temp.style.visibility = "hidden";  
                        p.appendChild(temp);    // insert it into the parent for em and ex  
                        textWidth = $(temp).offset().left / scale - pLeft - spanLeft;
                        p.removeChild(temp);
                    }
                  
                    // console.log('r', spanTabWidth, (nextTabstop.pos - spanLeft));
                    spanTabWidth = Math.max(0, nextTabstop.pos - spanLeft - textWidth);

                } else if (align=='center') {
                    // this will become more complicated if we need to handle text that contains a linebreak
                    $(spanTab).css('display', 'inline-block');
                  
                    // calc width of text to the next tab. if there isn't one add a temp one to the end of the P
                    if (j + 1 < spanTabs.length) {
                        var nextTab = spanTabs[j+1];
                        textWidth = $(nextTab).offset().left / scale - pLeft - spanLeft;
                    } else {
                        var temp = document.createElement("span");  // create temporary element
                        temp.style.overflow = "hidden";    
                        temp.style.visibility = "hidden";  
                        p.appendChild(temp);    // insert it into the parent for em and ex  
                        textWidth = $(temp).offset().left / scale - pLeft - spanLeft;
                        p.removeChild(temp);
                    }
                  
                    // console.log('r', spanTabWidth, (nextTabstop.pos - spanLeft));
                    spanTabWidth = Math.max(0, nextTabstop.pos - spanLeft - textWidth / 2);

                } else if (align=='decimal') {
                
                    // right alight the text before the decimalSpanNode, then remove the decimalSpanNode
                    textWidth = $(decimalSpanNode).offset().left / scale - pLeft - spanLeft;
                    // is guaranteed to have text nodes on either side, merge these back again
                    var prevTextNode = decimalSpanNode.previousSibling;
                    var prevText = prevTextNode.nodeValue;
                    var nextTextNode = decimalSpanNode.nextSibling;
                    decimalSpanNode.parentNode.removeChild(prevTextNode);
                    decimalSpanNode.parentNode.removeChild(decimalSpanNode);
                    nextTextNode.nodeValue = prevText + nextTextNode.nodeValue;
                  
                    // console.log('r', spanTabWidth, (nextTabstop.pos - spanLeft));
                    spanTabWidth = Math.max(0, nextTabstop.pos - spanLeft - textWidth);
                    
                    
                } else {
                    // console.log('a', align);
                    // @TODO more tabstop types
                }
                $(spanTab).css('display', 'inline-block');
                
                // leaderModes
                if (leaderMode == 'border') {            
                    if ((leader == 'dotted' || leader == 'dashed' || leader=='solid') && spanTabWidth > 9) { // allow ooxml names here
                        // @TODO leader color
                        $(spanTab).css('borderBottom', leader + ' 1px');
                        $(spanTab).css('margin', '0px 4px'); 
                        $(spanTab).css('width', (spanTabWidth - 8) + 'px'); // bit of whitespace on either side of the line
                    } else {
                        $(spanTab).css('width', spanTabWidth + 'px');
                    }
                } else {
                    // .width() only gives us 4 digits of precision, but spanTabWidth might by slightly smaller
                    // e.g. width() = 37.7969, spanTabWidth = 37.796875
                    $(spanTab).css('minWidth', spanTabWidth + 'px');
                    spanTabWidth = $(spanTab).width(); // this'll do.
                    // $(spanTab).css('wordWrap', 'something');
                    // add a character to the span tab until it expands, then remove the last character
                    var ch = (leader == 'dotted' ? '.' :
                      (leader == 'dashed' ? '-' :
                      (leader == 'solid' ? '_' : 
                      (leader == 'blank' ?  '\u00a0' :  // &nbsp; // @TODO check OOXML
                      (leader && leader.startsWith('"') && leader.endsWith('"') ? leader.substring(1, leader.length - 1).replaceAll(' ', '\u00a0') :  // &nbsp; // @TODO check OOXML
                      '\u00a0')))));
                    if (ch.length > 1) { $(spanTab).css('textAlign', 'right'); }
                    var textNode = document.createTextNode(ch);
                    var c = 1;
                    spanTab.appendChild(textNode);
                    while ($(spanTab).width() <= spanTabWidth && c < 1000) { // just in case
                        textNode.nodeValue += ch; c += 1;
                    }
                    textNode.nodeValue = textNode.nodeValue.substring(0, c * ch.length - 1);
                }
            }
        }); // spanTabs.each()
    }

    
})($);

