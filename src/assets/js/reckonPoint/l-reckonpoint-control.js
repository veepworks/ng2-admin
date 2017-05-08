L.ReckonPoint = L.ReckonPoint || {};
L.reckonPoint = L.reckonPoint || {};

L.ReckonPoint.Control = L.Control.extend({

});

L.ReckonPoint.Control.MqttState = L.ReckonPoint.Control.extend({
  options: {
      position: 'topleft'
  },
  initialize: function (mqttClient, options) {
      L.setOptions(this, options);
  },
  onAdd: function(map) {
      const containerName = 'reckonpoint-control-mqttstate';
      const container = L.DomUtil.create('div', containerName);
      this._mqttStateInputText = L.DomUtil.create('input', null, container);
      this._mqttStateInputText.type = 'text';
      this._mqttStateInputText.value = mqttState.DISCONNECTED;
      this._mqttStateInputText.readOnly = 'true';
      this._mqttStateInputText.style = 'text-align: center;';
      map.on('mqttstatechange', this._mqttStateChanged, this);
      return container;
  },
  onRemove: function(map) {
      return;
  },
  changeState(newState) {
      this._mqttStateInputText.value = newState;
  },
  _mqttStateChanged(event) {
      this.changeState(event.state);
  }
});

L.ReckonPoint.Map.mergeOptions({
	mqttStateControl: false
});

L.ReckonPoint.Map.addInitHook(function() {
    if (this.options.mqttStateControl) {
		this.mqttStateControl = new L.ReckonPoint.Control.MqttState();
		this.addControl(this.mqttStateControl);
	}
});
