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

  // I read that getBoundingClientRect() is really slow so it should be called by some resize event
  resizeToFillMap: function() {
    var rect = this._map.getContainer().getBoundingClientRect()
    if(rect.width != this._image.width || rect.height != this._image.height) {
      this._image.width = rect.width
      this._image.height = rect.height
      ctx = this._image.getContext('2d')
    }
    return rect
  },

  _reset: function () {
    if(this._map) {
      var pos = this._map._getMapPanePos().multiplyBy(-1);
      L.DomUtil.setTransform(this.getElement(), pos, 1)
    }
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
