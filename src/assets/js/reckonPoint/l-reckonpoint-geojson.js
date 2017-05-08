L.ReckonPoint = L.ReckonPoint || {};
L.ReckonPoint.GeoJSON = {};
L.ReckonPoint.GeoJSON.Feature = {};

L.ReckonPoint.GeoJSON.Feature.Default = L.GeoJSON.extend({
    options: {
        filter: function(geoJsonFeature) {
            return true;
        },
        onEachFeature: function(geojson, layer) {
            return;
        }
    },
});

L.ReckonPoint.GeoJSON.Feature.Devices = L.ReckonPoint.GeoJSON.Feature.Default.extend({
    options: {
        pointToLayer: function(geojson, latlng) {

            var icon = L.reckonPoint.icon();

            if('properties' in geojson && 'marker' in geojson.properties) {
                icon = L.reckonPoint.icon(geojson.properties.marker);
            }

            return L.reckonPoint.marker(latlng, { icon: icon });

        },
        filter: function(geojson) {
            if(geojson.properties && geojson.properties.deviceId) {
                return true;
            } else {
                return false;
            }
        },
        onEachFeature: function(geojson, layer) {
            console.log('MarkerId = ' + layer.getMarkerId());
            return;
        }
    },
    initialize: function(geojson, options) {
        L.setOptions(this, options);
        this._layers = {};
        this._devices = {};
        this.on('layeradd', function(e) {
            if(e.layer && e.layer.feature && e.layer.feature.properties && e.layer.feature.properties.deviceId) {
                this._devices[e.layer.feature.properties.deviceId] = {
                    markerId: e.layer.getMarkerId(),
                    layerId: this.getLayerId(e.layer)
                };
            }
        });
        if (geojson) {
            this.addData(geojson);
        }
    },
    addData: function(geojson) {
        console.log('addData');
        if(this._devices.hasOwnProperty(geojson.properties.deviceId))
        {
            console.log('found device');
            const newLatlng = L.latLng(geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]);
            this.getLayer(this._devices[geojson.properties.deviceId].layerId).setLatLng(newLatlng);
            return null;
        } else {
            L.ReckonPoint.GeoJSON.Feature.Default.prototype.addData.call(this, geojson);
        }
    }
});
