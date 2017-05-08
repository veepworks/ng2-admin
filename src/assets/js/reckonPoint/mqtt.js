var reckonPoint = reckonPoint || {};

reckonPoint.mqtt = reckonPoint.mqtt || {};

const mqttState = {
    DISCONNECTED: 'MQTT Disconnected',
    CONNECTED: 'MQTT Connected',
    CONNECTFAILED: 'MQTT Connection Failed',
    CONNECTIONLOST: 'MQTT Connection Lost',
    ERROR: 'MQTT Error'
};

reckonPoint.mqtt.state = mqttState;

reckonPoint.mqtt.clientFactory = {
    awsIotClient: {
        create: function(options) {

            webSocketClient = this;

            const defaultOptions = {
                credentials: AWS.config.credentials,
                endpoint: 'a20n47co39cidz.iot.us-east-1.amazonaws.com',
                region: 'us-east-1',
            };

            options = reckonPoint.utils.extend({}, defaultOptions, options);

            if(!options.hasOwnProperty('clientId')) {
                options.clientId = reckonPoint.utils.newUUID();
            }

            return options.credentials.getPromise()
            .then(function() {
                const requestUrl = reckonPoint.utils.getSig4SignedUrl(
                    'wss',
                    options.endpoint,
                    '/mqtt',
                    'iotdevicegateway',
                    options.region,
                    options.credentials);

                const client = new Paho.MQTT.Client(requestUrl, options.clientId);

                webSocketClient.fire('client_ready', client);

                return Promise.resolve(client);

            })
            .catch(function(error) {
                webSocketClient.fire('error', error);
                return Promise.reject(error);
            });
        }
    }
};

function WebSocketClient(clientType, options) {

    this._clientType = clientType || 'awsIotClient';
    this._options = options || {};

    const storage = Storages.initNamespaceStorage('reckonPoint').localStorage;

    if(storage.isSet('mqttClientId')) {
        this._options.clientId = storage.get('mqttClientId');
    } else {
        this._options.clientId = reckonPoint.utils.newUUID();
        storage.set('mqttClientId', this._options.clientId);
    }

    reckonPoint.utils.addEventHandlers.call(this);

    console.log(this);

}

WebSocketClient.prototype.constructor = WebSocketClient;

WebSocketClient.prototype.connect = function() {

    const clientFactory = reckonPoint.mqtt.clientFactory[this._clientType];

    clientFactory.create.call(this, this._options);

    this.on('client_ready', onClientReady, this);

    function onClientReady(type, client) {
        this._client = client;
        this._initClient.call(this);
        this._connect.call(this);
    }

};

WebSocketClient.prototype.subscribe = function(topic, options) {

    const self = this;

    const subscribeOptions = {
        onSuccess: function(response) {
            console.log('subscribed');
            self.fire.call(self, 'subscribed', response);
        },
        onFailure: function(response) {
            console.log('subscribe_failed');
            self.fire.call(self, 'subscribe_failed', response);
        },
        qos: 0
    };

    options = options ? reckonPoint.utils.extend({}, subscribeOptions, options) : subscribeOptions;

    self._client.subscribe(topic, options);

};

WebSocketClient.prototype._onMessageArrived = function(message) {
    console.log('onMessageArrived');

    var payload = message.payloadString;

    const context = {
        messageType: 'mqtt',
        topic: message.destinationName,
        duplicate: message.duplicate
    };

    if(payload && typeof payload === 'string') {
        context.contentType = 'string';
    } else {
        context.contentType = 'unknown';
        payload = message.payloadBytes;
    }

    this.fire.call(this, 'new_message',
    {
        message:
        {
            context: context,
            payload:payload
        }
    });

};

WebSocketClient.prototype._connect = function() {

    function onSuccess(response, resolve) {
        this.fire.call(this, 'connected', { state: mqttState.CONNECTED, response: response });
    }

    function onFailure(response, reject) {
        console.error('WebSocketClient connect failed');
        console.error(response);
        this.fire.call(this, 'connect_failed', { state: mqttState.CONNECTFAILED, response: response });
    }

    function onError(error, reject) {
        console.error('Error caused by WebSocketClient connect');
        console.error(error);
        this.fire.call(this, 'connection_error', { state: mqttState.ERROR, response: response });
    }

    const connectOptions = {
        onSuccess: onSuccess.bind(this),
        onFailure: onFailure.bind(this),
        useSSL: true,
        timeout: 3,
        mqttVersion: 4
    };

    this._client.connect(connectOptions);

};

WebSocketClient.prototype._initClient = function() {
    this._client.onConnectionLost = this._onConnectionLost.bind(this);
    this._client.onMessageArrived = this._onMessageArrived.bind(this);
};

WebSocketClient.prototype._onConnectionLost = function(response) {
    console.log('connection_lost');
    console.log(response);
    this.fire.call(this, 'connection_lost', { state: mqttState.CONNECTIONLOST, response: response });
};

reckonPoint.mqtt.WebSocketClient = WebSocketClient;
