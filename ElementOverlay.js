/*
 * L.ElementOverlay is used to overlay images over the map (to specific geographical bounds).
 *    Basically the same as an image overlay, but it takes any element 
 */

L.ElementOverlay = L.ImageOverlay.extend({
 
  _initImage: function () {
    var img
    if( typeof this._url === "string"){
      img = this._image = L.DomUtil.create('img',
        'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));
      img.onload = L.bind(this.fire, this, 'load');
      img.src = this._url;
    }else{
      img = this._image = this._url
      setTimeout( L.bind(this.fire, this, 'load'),0);
    }

    img.onselectstart = L.Util.falseFn;
    img.onmousemove = L.Util.falseFn;

    img.alt = this.options.alt;
  },

});

L.elementOverlay = function (url, bounds, options) {
  return new L.ElementOverlay(url, bounds, options);
};