/*

A Layer that covers the whole map and does not move

*/
L.StaticLayer = L.ElementOverlay.extend({

  initialize: function (url, options) { // (String, LatLngBounds, Object)
    console.log('static layer init called')
    this._url = url;
    this._bounds = L.latLngBounds([0,0],[1,1])// the are not going to be used
    L.setOptions(this, options);
    //'resize',
    //            'move',
    //            'moveend'

  },
  /*reposition: function () {
    var pos = this.map._getMapPanePos().multiplyBy(-1);
    L.DomUtil.setPosition(this._image, pos);
  },
  */
  /*onAdd: function(map) {
    console.log('onadd called', arguments)
    map.on('resize', this._moveEventFired, this)
    map.on('move', this._moveEventFired, this)
    map.on('moveend', this._moveEventFired, this)
  },*/

  _moveEventFired: function (e) {
    console.log('move event fired')
    this._reset()
  },

  _animateZoom: function (e) {
    console.log('animate zoom called')
    this._reset()
  },

  eventsRegistered:false,

  _reset: function () {
    console.log('reset called')
    var pos = this._map._getMapPanePos().multiplyBy(-1);
    L.DomUtil.setTransform(this.getElement(), pos, 1)
    if(!this.eventsRegistered) {
      console.log('registered events')
      this.eventsRegistered = true
      map.on('resize', this._moveEventFired, this)
      map.on('move', this._moveEventFired, this)
      map.on('moveend', this._moveEventFired, this)
    }
  },
});
