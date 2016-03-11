/*

A Layer that covers the whole map and does not move

*/
L.StaticLayer = L.ElementOverlay.extend({

  initialize: function (url, options) { // (String, LatLngBounds, Object)
    //console.log('static layer init called')
    this._url = url;
    this._bounds = L.latLngBounds([0,0],[1,1])// the are not going to be used
    L.setOptions(this, options);
    this.eventsRegistered = false
  },

  _moveEventFired: function (e) {
    this._reset()
    this.fire('mymapmoved')
  },

  _animateZoom: function (e) {
    this._reset()
  },

  calcMatrix: function() {
    var b = map.getBounds()
    var p = map.getPixelBounds()
    var pw = p.max.x - p.min.x
    var ph = p.max.y - p.min.y
    var bw = b.getEast() - b.getWest()
    var bh = b.getNorth() - b.getSouth()
    var rx = bw / pw
    var ry = bh / ph
    var dx = - b.getWest()
    var dy = - b.getNorth()
    // projection matrix. I guess these are column vectors so it looks transposed here.
    var projection = [rx,0,0,0,
                      0,ry,0,0,
                      0,0,1,0,
                      dx,dy,0,1 ]
    return projection
  },

  _reset: function () {
    var pos = this._map._getMapPanePos().multiplyBy(-1);
    L.DomUtil.setTransform(this.getElement(), pos, 1)
    this.registerMyEvents.bind(this)()
  },

  registerMyEvents: function (onoff) {
    if(!this.eventsRegistered) {
      //console.log('registered events')
      this.eventsRegistered = true
      this._map.on('resize', this._moveEventFired, this)
      this._map.on('move', this._moveEventFired, this)
      this._map.on('moveend', this._moveEventFired, this)
    }
    if(onoff == 'off') {
      this._map.off('resize', this._moveEventFired, this)
      this._map.off('move', this._moveEventFired, this)
      this._map.off('moveend', this._moveEventFired, this)
      this.eventsRegistered = false
    }
  }
});
