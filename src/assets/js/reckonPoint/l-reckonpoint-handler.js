L.ReckonPoint = L.ReckonPoint || {};

L.ReckonPoint.Map.mergeOptions({
    newMessageHandler: false,
    jsonMessageHandler: false,
    geoJsonMessageHandler: false
});

L.FeatureGroup.include({
    _geoJsonFeatures: {},
    addGeoJsonFeatureLayer: function(geoJson) {
        if(!this.hasGeoJsonFeatureLayer(geoJson)) {
            if(reckonPoint.utils.isGeoJsonFeature(geoJson)) {

                var geoJSONFeature;

                if(geoJson.id && geoJson.id in L.reckonPoint.geoJSON.feature) {
                    geoJSONFeature = L.reckonPoint.geoJSON.feature[geoJson.id]();
                } else {
                    geoJSONFeature = L.reckonPoint.geoJSON.feature.default();
                }

                const layerId = L.Util.stamp(geoJSONFeature);
                this._geoJsonFeatures[geoJson.id] = { layerId: layerId };
                geoJSONFeature.addData(geoJson);
                this.addLayer(geoJSONFeature);
            }
        }
        return this;
    },
    hasGeoJsonFeatureLayer: function(geoJson) {
        if(geoJson && geoJson.id && reckonPoint.utils.isGeoJsonFeature(geoJson)) {
            if(geoJson.id in this._geoJsonFeatures) {
                return true
            }
            return false;
        }
    },
    getGeoJsonFeatureLayer: function(geoJson) {
        if(geoJson && this.hasGeoJsonFeatureLayer(geoJson)) {
            return this.getLayer(this._geoJsonFeatures[geoJson.id].layerId);
        }
        return undefined;
    }
});

L.ReckonPoint.Handler = L.Handler.extend({
    initialize: function (map) {
		this._map = map;
	}
});

L.ReckonPoint.Handler.MqttHandler = L.ReckonPoint.Handler.extend({
    addHooks: function() {

    },
    removeHooks: function() {

    }
});

L.ReckonPoint.Handler.MessageHandler = L.ReckonPoint.Handler.extend({
    _eventName: 'new_messagereceived',
    addHooks: function() {
        this._map.on(this._eventName, this._onNewMessage, this);
        if(this._onHooks && this._onHooks.hasOwnProperty('add')) {
            this._onHooks.add.call(this);
        }
    },
    removeHooks: function() {
        this._map.off(this._eventName, this._onNewMessage, this);
        if(this._onHooks && this._onHooks.hasOwnProperty('remove')) {
            this._onHooks.remove.call(this);
        }
    },
    _onHooks(action) {
        return;
    },
    _onNewMessage: function(e) {
        console.log('new_messagereceived');

        var message;

        if(e.message) {
             message = e.message;
        } else {
            console.error('the event did not have a message');
            return;
        }

        if(!message.payload) {
            console.error('the message does not have a payload');
            return;
        }

        if(message.context) {
            message.context.contentType = message.context.contentType || 'unknown';
        } else {
            message.context = { contentType: 'unknown' };
        }

        if (message.context.contentType === 'string' || typeof message.payload === 'string') {

            message.context.contentType = 'string';

            var payload;

            try {
                payload = JSON.parse(message.payload);
            } catch (e) {
                console.log('the new message is a string but is not json');
                console.error(e);
                this._map.fire('string_messagereceived', message);
                return;
            }

            message.payload = payload;

            if(reckonPoint.utils.isValidGeoJson(payload)) {
                message.context.contentType = 'geojson/' + payload.type;
                this._map.fire('geojson_messagereceived', message);
                return;
            }

            message.context.contentType = 'json';
            this._map.fire('json_messagereceived', message);

        } else {
            message.context.contentType = 'unknown';
            console.error('no handlers configured for non string messages');
            this._map.fire('unknown_messagereceived', message);
            return;
        }
    }
});

L.ReckonPoint.Handler.JsonMessageHandler = L.ReckonPoint.Handler.MessageHandler .extend({
    _eventName: 'json_messagereceived',
    _onNewMessage: function(message) {
        console.log('json_messagereceived');
    }
});

L.ReckonPoint.Handler.GeoJsonMessageHandler = L.ReckonPoint.Handler.JsonMessageHandler.extend({
    _eventName: 'geojson_messagereceived',
    _onNewMessage: function(message) {
        console.log('geojson_messagereceived');
        const geojson = message.payload;
        if(this._geoJsonLayer.hasGeoJsonFeatureLayer(geojson)) {
            this._geoJsonLayer.getGeoJsonFeatureLayer(geojson).addData(geojson);
        } else {
            this._geoJsonLayer.addGeoJsonFeatureLayer(geojson);
        }
    },
    _onHooks: {
        add: function() {
            this._layerMap = {};
            this._geoJsonLayer = L.featureGroup().addTo(this._map);
            this._geoJsonLayer.on('layeradd', function(e){
                console.log(L.Util.stamp(e.layer));
            });
        },
        remove: function() {
            if(this._geoJsonLayer) {
                if(this._map.hasLayer(this._geoJsonLayer)) {
                    this._map.removeLayer(this._geoJsonLayer);
                }
                this._geoJsonLayer.clearLayers();
                this._geoJsonLayer = null;
            }
        }
    }
});

L.ReckonPoint.Map.addInitHook('addHandler', 'newMessageHandler', L.ReckonPoint.Handler.MessageHandler);
L.ReckonPoint.Map.addInitHook('addHandler', 'jsonMessageHandler', L.ReckonPoint.Handler.JsonMessageHandler);
L.ReckonPoint.Map.addInitHook('addHandler', 'geoJsonMessageHandler', L.ReckonPoint.Handler.GeoJsonMessageHandler);
