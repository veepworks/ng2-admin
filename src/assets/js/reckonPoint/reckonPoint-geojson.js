var reckonPoint = reckonPoint || {};

reckonPoint.geojson = reckonPoint.geojson || {};

reckonPoint.geojson.isFeature = function(obj) {
    if(obj.geometry && obj.type && obj.type === 'Feature') {
        console.log('is a valid geojson feature');
        return true;
    } else {
        console.log('NOT a valid geojson feature');
        return false;
    }
};
