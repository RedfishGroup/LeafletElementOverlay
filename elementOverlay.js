/*
 * L.ElementOverlay is used to overlay images over the map (to specific geographical bounds).
 *    Basically the same as an image overlay, but it takes any element 
 */

L.ElementOverlay = L.ImageOverlay.extend({
 
  _initImage: function () {
    var img;
    if(this._image) {
      this.onRemove()
    }
    if( typeof this._url === "string"){
      img = this._image = L.DomUtil.create('img',
        'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));
      img.onload = L.bind(this.fire, this, 'load');
      img.src = this._url;
    }else{
      img = this._image = this._url;
      //L.DomUtil.addClass( img, 'leaflet-image-layer')
      //L.DomUtil.addClass( img, this._zoomAnimated ? 'leaflet-zoom-animated' : '')
      setTimeout( L.bind(this.fire, this, 'load'),0);
    }

    img.onselectstart = L.Util.falseFn;
    img.onmousemove = L.Util.falseFn;
    img.alt = this.options.alt;
    img.style.position = "absolute"
  },

  setUrl: function (url) { //this is only needed for leaflet < 0.7.3. Can be removed with 1.0, but there is no CDN yet
    this._url = url;

    if (this._image) {
      this._image.src = url;
    }
    return this;
  },

});

L.elementOverlay = function (url, bounds, options) {
  return new L.ElementOverlay(url, bounds, options);
};