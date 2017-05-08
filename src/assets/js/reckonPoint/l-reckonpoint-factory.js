L.reckonPoint = L.reckonPoint || {};

L.reckonPoint.micelloMap = function(map, options) {
    return new L.ReckonPoint.MicelloMap(map, options);
};

L.reckonPoint.map = function(name, options) {
    return new L.ReckonPoint.Map(name, options);
};

L.reckonPoint.marker = function(latlng, options) {
    return new L.ReckonPoint.Marker(latlng, options);
};

L.reckonPoint.icon = function(options) {
    return new L.ReckonPoint.Icon(options);
};

L.reckonPoint.geoJSON = {};

L.reckonPoint.geoJSON.feature = {
    default: function(geojson, options) {
        return new L.ReckonPoint.GeoJSON.Feature.Default(geojson, options);
    },
    devices: function(geojson, options) {
        return new L.ReckonPoint.GeoJSON.Feature.Devices(geojson, options);
    }
};

L.reckonPoint.control = {
    mqttState: function(options) {
        return new L.ReckonPoint.Control.MqttState(options);
    }
};

L.reckonPoint.icons = {
    default: L.icon({
        iconUrl: 'images/marker-icon.png',
        iconSize: [14, 21],
        iconAnchor: [7, 20]
    })
};
