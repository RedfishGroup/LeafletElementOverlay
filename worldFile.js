/*
Parse and display a world file
http://en.wikipedia.org/wiki/World_file

Cody Smith and Redfish Group 2015

usgage:
    var urlTest = new L.WorldFile({imageUrl:"data/splat.png", textUrl:"data/splat.pgw"})
    urlTest.addTo(map)
*/
L.WorldFile = L.ElementOverlay.extend({
    initialize: function (options) { //options {imgUrl, textUrl}
        console.log('init called')
        this.refreshWorldFile(options)
        L.setOptions(this, options)
        this.zoomAnimated = false
        this.TRANSFORMORIGIN = L.DomUtil.testProp(['TransformOrigin', 'WebkitTransformOrigin', 'MozTransformOrigin', 'msTransformOrigin', 'OTransformOrigin'])
    },

    params: {a:1, b:0, c:0, d:0, e:1, f:0},
    zoomAnimated:false,

    // change the world file
    //
    refreshWorldFile: function(options) {
        // some default values
        var southWest = L.latLng(0,0)
        var northEast = L.latLng(1,1)
        this._bounds = L.latLngBounds(southWest, northEast);
        // check
        if( !options.image && !options.imageUrl) {
            throw('no image specified. ')
        }
        if( !options.params && !options.text && !options.textUrl) {
            throw('no world file text specified ')
        }
        if( options.params) {
            this.params = options.params
        } else if( options.text) {
            this.parseText(options.text)
        } else if( options.textUrl) {
            this.loadText(options.textUrl)
        }
        this.on('load', function(){
            this.parseParams(this.params)
        }.bind(this))
        this.setUrl(options.image || options.imageUrl)
    },

    loadText: function(textUrl) {
        var oReq = new XMLHttpRequest()
        oReq.onload = function(e){
            this.parseText(e.target.responseText)
        }.bind(this)
        oReq.open("get", textUrl, true)
        oReq.send()
    },

    parseText: function(text) {
        this.worldFileText = text
        var items = text.split("\n");
        if(items.length < 6) {
            throw("world file not in correct format")
        }
        for( var i=0; i < 6; i++) {
            var it=items[i];
            items[i] = Number(it);
            if( items[i] == NaN){
                throw(" world file format error" +  items[i])
            }
        }
        var params = {a:items[0], b:items[2], c:items[4], d:items[1], e:items[3], f:items[5]};
        this.params = params
        this.parseParams()
    },

    parseParams:function(params){
        params = params || this.params
        if( this._image && params){
            var wid = this._image.naturalWidth || this._image.width
            var hei = this._image.naturalHeight || this._image.height
            var lr = this.pixelToWorld(wid,hei) //L.latLng(params.e*wid + params.f, params.a*hei + params.c)
            var ul = this.pixelToWorld(0,0) //L.latLng(params.f, params.c)
            var ll = this.pixelToWorld(0,hei)
            this._bounds =  L.latLngBounds(ul, lr)
            this._reset()
        }
    },

    // convert image pixel coords to lat lon
    //
    pixelToWorld: function(x,y) {
        var wp = this.params
        var lon = wp.a*x + wp.b*y + wp.c
        var lat = wp.d*x + wp.e*y + wp.f
        return L.latLng(lat,lon)
    },

    // Converts a latlng on the world to a pixel coordinate in the map's 
    // div.
    latlngToContainerPoint: function(latlng) {
        var pixel_on_world = map.latLngToLayerPoint(latlng);
        var pixel_in_container = map.layerPointToContainerPoint(pixel_on_world);
        return pixel_in_container;
    },

    _reset: function () {
        var image = this._image
        var wid = this._image.naturalWidth || this._image.width
        var hei = this._image.naturalHeight || this._image.height
        var lr = this.pixelToWorld(wid,hei) 
        var ul = this.pixelToWorld(0,0) 
        var ll = this.pixelToWorld(0,hei)
        var ur = this.pixelToWorld(wid,0) 
        var markerLr = this.latlngToContainerPoint(lr)
        var markerUl = this.latlngToContainerPoint(ul)
        var markerLl = this.latlngToContainerPoint(ll)
        var markerUr = this.latlngToContainerPoint(ur)
        var offset = map.layerPointToContainerPoint( new L.Point(0,0))
        //calculate transform matrix
        var m11 = (markerUr.x - markerUl.x) / wid
        var m12 = (markerUr.y - markerUl.y) / wid
        var m21 = (markerLr.x - markerUr.x) / hei
        var m22 = (markerLr.y - markerUr.y) / hei
        var dx =  markerUl.x - offset.x
        var dy =  markerUl.y - offset.y
        //there it is
        console.log(offset)
        var matrix3d = "matrix(" +m11+ ", "+m21+", "+m12+", "+m22+", "+dx+", "+dy+")"
        console.log(matrix3d)
        image.style[this.TRANSFORMORIGIN] = '0 0'
        image.style['transform'] = matrix3d
    },
})