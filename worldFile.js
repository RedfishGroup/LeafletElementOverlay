
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
        console.log(text);
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
        console.log(params)
        if( this._image && params){
            console.log(this._image.naturalWidth, this._image.naturalHeight,this._image)
            var lr = L.latLng(params.e*this._image.naturalHeight + params.f, params.a*this._image.naturalWidth + params.c)
            var ul = L.latLng(params.f, params.c)
            console.log(ul,lr)
            this._bounds =  L.latLngBounds(ul,lr)
            console.log(this._bounds)
            this._reset()
        }
    },
})