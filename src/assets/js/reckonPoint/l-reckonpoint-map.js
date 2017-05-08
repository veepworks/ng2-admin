L.ReckonPoint = L.ReckonPoint || {};

L.ReckonPoint.Map = L.Map.extend({
    options: {
        zoomControl: false,
        attributionControl: false
    }
});

L.ReckonPoint.Map.addInitHook(function() {
    L.control.attribution({
        position: 'bottomright',
        prefix:
            '<a href="http://www.dreamapp.io" title="Personal Situational Awareness from people and things in your community">DREAM</a> | ' +
            '<a href="http://www.reckonpoint.com" title="Indoor Positioning Services">Reckon Point</a> | ' +
            '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
    }).addTo(this);

    this.zoomControl = L.control.zoom({
        position: 'bottomright'
    });

    this.addControl(this.zoomControl);

});

L.ReckonPoint.LevelLayers = L.Evented.extend({
    initialize: function(levelIds, options) {
        L.Util.setOptions(this, options);
        this._levels = {};
        levelIds.forEach(function(id) {
            this._levels[id] = {
                devices: L.layerGroup()
            }
        });
    },
    getLevel(id) {
        return this._levels[id];
    },
    addLevelToMap() {

    }
});

L.ReckonPoint.MicelloMap = L.Evented.extend({
    options: {
        levelUIPosition: 'bottomleft'
    },
    _type: 'MicelloMap',
    initialize: function(map, options) {
        L.Util.setOptions(this, options);
        this._map = map;
        L.micello.loader.on('indoorReady', this._indoorReady.bind(this));
    },
    getType() {
        return this._type;
    },
    getMap: function() {
        return this._map;
    },
    getCommunity: function() {
        return this.community;
    },
    getCommunityId: function() {
        return this.options.communityId;
    },
    getLevelIds: function() {
        return Object.keys(this.community.getMapLayers().getTileLayerMap());
    },
    _indoorReady: function() {
        this.community = L.micello.community(this.options.communityId, this.options).addTo(this._map);
        this.community.on('indoorCommunityLoadComplete', this._communityLoadComplete.bind(this));
        this.community.on('indoorLevelUpdated', this._levelUpdated.bind(this));
    },
    _communityLoadComplete: function() {
        this.fireEvent('micelloloadcomplete', this);
        this._map.fireEvent('mapdataloadcomplete', this);
    },
    _levelUpdated: function() {
        const levelIds = this.community.getMapLayers().getActiveLevel().map(function(level) {
            if(level.hasOwnProperty('id')) {
                return level.id;
            }
        });
        this.fireEvent('levelchange', this);
        this._map.fireEvent('maplevelchange', { activeLevelIds: levelIds });
    }
});
