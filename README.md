Leaflet Element Overlay
================

There are 3 parts to this repository:
* Worldfile Overlay : This is used for viewing worldfiles with leaflet. 
* Element Overlay : Is a hack on the ImageOverlay. It allows html elements to be used as image overlays. 
* Progression Overlay: This displays a kind of custom worldfile that has time values in the RGB channels of the image. We use it for fire progressions. 

DEMO: http://redfishgroup.github.io/LeafletElementOverlay/

examples:
==============
Worldfile:
``` javascript
    var urlTest = new L.WorldFile({imageUrl:"data/NM-N6S-F5PS.png", textUrl:"data/NM-N6S-F5PS.pgw", opacity:0.4})
    urlTest.addTo(map) 
```
... for more examples look at index.html


