L.ReckonPoint = L.ReckonPoint || {};
L.reckonPoint = L.reckonPoint || {};

L.ReckonPoint.Marker = L.Marker.extend({
    _markerId: reckonPoint.utils.newUUID(),
    getMarkerId: function() {
        return this._markerId
    }
});

if(typeof L.AwesomeMarkers.Icon !== 'undefined') {
    L.ReckonPoint.Icon = L.AwesomeMarkers.Icon.extend({
        options: {
            icon: 'circle-o',
            className: 'awesome-marker',
            prefix: 'fa',
            markerShape: 'round'
        }
    });

    L.ReckonPoint.Icon.addInitHook(function() {

        if(this.options.markerShape === 'square') {
            this.options.className = this.options.className + ' awesome-marker-square';
        }

    });
} else {
    L.ReckonPoint.Icon = L.Icon.Default;
}
