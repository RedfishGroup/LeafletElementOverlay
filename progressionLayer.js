L.ProgresionLayer = L.WorldFile.extend({
    /*
        A hacky way to display an animated fire progression on the map

    */
      _initImage: function () {
        this._dataImg;
        if(this._image) {
          this.onRemove()
        }
        this._image = L.DomUtil.create('canvas',
            'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));
        this._image.width = this._image.height = 12
        if( typeof this._url === "string"){
          this._dataImg = new Image()
          this._dataImg.onload = function(){
            this.prepareCanvas()
            this.fire('load')
          }.bind(this)
          this._dataImg.src = this._url;
        }else{
          this._dataImg = this._url
          this.prepareCanvas()
          setTimeout( L.bind(this.fire, this, 'load'),0);
        }
        this._image.onselectstart = L.Util.falseFn;
        this._image.onmousemove = L.Util.falseFn;
        this._image.alt = this.options.alt;
        this._image.style.position = "absolute"
      },

    prepareCanvas : function() {
        console.log('prepare canvas called')
        this.getDataFromImage(this._dataImg)
        this._image.width = this._dataImg.naturalWidth
        this._image.height = this._dataImg.naturalHeight
        this._ctx = this._image.getContext('2d')
        this._canvasData = this._ctx.getImageData( 0,0, this._image.width, this._image.height)
        this.redrawCanvas(0)
    },

    redrawCanvas: function(time) {
        //console.log('redraw called',time)
        for(var i=0; i < this.values24bit.length; i++) {
            var i2 = 4*i
            var toa= this.values24bit[i] 
            if( toa > 256*256*255){
                this._canvasData.data[i2+3] = 0
            } else if( toa <= time) {
                var tmp = (time - toa)/(this.stats.range)
                this._canvasData.data[i2+3] = Math.max(255*Math.pow(( 1.0-tmp),2) , 40) ;
                this._canvasData.data[i2] = 255*Math.pow((1.0 - tmp),3) ;
                this._canvasData.data[i2+1] = 255*Math.pow((1.0 - tmp),20) ;
                this._canvasData.data[i2+2] = 0.0
            } else {
                this._canvasData.data[i2+3] = 0
            }
        }
        this._ctx.putImageData(this._canvasData,0,0)
    },

    getDataFromImage : function(img) {
        img.imagedata = this.getImageData(img)
        this.values24bit = this.parse24BitsVals(img.imagedata)
        this.stats = this.getMaxMin(this.values24bit)
    },

    parse24BitsVals : function(imagedata) {//this is for fire data
        var values24bit = new Int32Array( imagedata.width * imagedata.height)
        var indx=0
        for( var i = 0 ; i < imagedata.data.length; i = i + 4) {
            var val = 256*256*imagedata.data[i] + 256*imagedata.data[i+1] + imagedata.data[i+2]
            values24bit[indx] = val
            indx++;
        }
        this.getMaxMin( values24bit)
        return values24bit
    },

    getMaxMin : function(values24bit) {
        var MAX = Number.MIN_VALUE
        var MIN = Number.MAX_VALUE
        var stats = {}
        for( var i = 0 ; i < values24bit.length; i++) {
            var val = values24bit[i]
            if( val > 0 && val < 256*256*255) {
                if( val < MIN ) { MIN = Number(val) }
                if( val > MAX) { MAX = Number(val)}
            }
        }
        stats.max= MAX
        stats.min = MIN
        stats.range = MAX - MIN
        return stats
    },
    
    getImageData : function(img, offsetx,offsety, newwidth, newheight) {
        var can = document.createElement('canvas');
        if( ! newwidth || !newheight ) {
            can.width = img.width;
            can.height = img.height;
            var ctx = can.getContext('2d');
            ctx.drawImage(img,0,0);
        }
        else{
            can.width = newwidth;
            can.height = newheight;
            var ctx = can.getContext('2d');
            ctx.drawImage(img,0,0,newwidth, newheight);
        }
        var imgData = ctx.getImageData(0,0, can.width, can.height);
        return imgData;
    },



})