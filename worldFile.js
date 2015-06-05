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
        var southWest = L.latLng(0,0)
        var northEast = L.latLng(1,1)
        this._bounds = L.latLngBounds(southWest, northEast);
    },

    refreshWorldFile: function(options) {
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
            var lr = L.latLng(params.e*this._image.naturalHeight + params.f, params.a*this._image.naturalWidth + params.c)
            var ul = L.latLng(params.f, params.c)
            this._bounds =  L.latLngBounds(ul, lr)
            this._reset()
        }
    },
})