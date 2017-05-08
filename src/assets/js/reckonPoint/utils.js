var reckonPoint = reckonPoint || {};

reckonPoint.utils = reckonPoint.utils || {};

reckonPoint.utils.newUUID = newUUID;
reckonPoint.utils.getSig4SignedUrl = getSig4SignedUrl;
reckonPoint.utils.loadjsfile = loadjsfile;
reckonPoint.utils.extend = extend;
reckonPoint.utils.addEventHandlers = addEventHandlers;

const validGeoJsonTypes = {
    Feature: {
        geometry: '[object Object]'
    },
    FeatureCollection: {
        features: '[object Array]'
    },
    Point: {
        coordinates : '[object Array]'
    },
    MultiPoint: {
        coordinates : '[object Array]'
    },
    LineString: {
        coordinates : '[object Array]'
    },
    MultiLineString: {
        coordinates : '[object Array]'
    },
    Polygon: {
        coordinates : '[object Array]'
    },
    MultiPolygon: {
        coordinates : '[object Array]'
    },
    GeometryCollection: {
        geometries: '[object Array]'
    }
}

reckonPoint.utils.create =  Object.create || (function () {
    function F() {

    }
    return function (proto) {
        F.prototype = proto;
        return new F();
    };
});

reckonPoint.utils.isValidGeoJson = function(obj) {
    if(obj.type && obj.type in validGeoJsonTypes) {
        const requiredProps = validGeoJsonTypes[obj.type];
        for (var p in requiredProps) {
            if(p in obj && Object.prototype.toString.call(obj[p]) === requiredProps[p]) {
                return true;
            }
        }
    }
    return false;
};

reckonPoint.utils.isGeoJsonFeature = function(obj) {
    if(obj && obj.type && obj.type === 'Feature' && obj.geometry) {
        return true;
    }
    return false;
};

// Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
// throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
// to avoid the entire page breaking, without having to do a check at each usage of Storage.
if (typeof localStorage === 'object') {
    try {
        localStorage.setItem('localStorage', 1);
        localStorage.removeItem('localStorage');
    } catch (e) {
        Storage.prototype._setItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function() {};
        //alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
    }
}



function extend()
{
    if(jQuery && 'extend' in jQuery) {
        return jQuery.extend.apply(this, arguments);
    } else {
        const dest = arguments[0] || {};
        var i, j, len, src;
    	for (j = 1, len = arguments.length; j < len; j++) {
    		src = arguments[j];
    		for (i in src) {
    			dest[i] = src[i];
    		}
    	}
    	return dest;
    }
}

function loadjsfile(file)
{
    return new Promise(function(resolve, reject) {
        var script = document.createElement('script');
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", file);
        document.getElementsByTagName("head")[0].appendChild(script);
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete")
            {
                resolve();
            }
        }
    });
}

function newUUID(a,b) {
    for(b=a='';a++< 36;b+=a * 51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');
    return b;
}

function sig4Sign (key, msg) {
    var hash = CryptoJS.HmacSHA256(msg, key);
    return hash.toString(CryptoJS.enc.Hex);
}

function sig4sha256(msg) {
    var hash = CryptoJS.SHA256(msg);
    return hash.toString(CryptoJS.enc.Hex);
}

function getSig4SignatureKey(key, dateStamp, regionName, serviceName) {
    var kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
    var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    var kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
    return kSigning;
}

function getSig4SignedUrl(protocol, host, uri, service, region, credentials) {
    var time = moment().utc();
    var dateStamp = time.format('YYYYMMDD');
    var amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
    var algorithm = 'AWS4-HMAC-SHA256';
    var method = 'GET';

    var credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request';
    var canonicalQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256';
    canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(credentials.accessKeyId + '/' + credentialScope);
    canonicalQuerystring += '&X-Amz-Date=' + amzdate;
    canonicalQuerystring += '&X-Amz-SignedHeaders=host';

    var canonicalHeaders = 'host:' + host + '\n';
    var payloadHash = sig4sha256('');
    var canonicalRequest = method + '\n' + uri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;

    var stringToSign = algorithm + '\n' + amzdate + '\n' + credentialScope + '\n' + sig4sha256(canonicalRequest);
    var signingKey = getSig4SignatureKey(credentials.secretAccessKey, dateStamp, region, service);
    var signature = sig4Sign(signingKey, stringToSign);

    canonicalQuerystring += '&X-Amz-Signature=' + signature;
    if (credentials.sessionToken) {
        canonicalQuerystring += '&X-Amz-Security-Token=' + encodeURIComponent(credentials.sessionToken);
    }

    var requestUrl = protocol + '://' + host + uri + '?' + canonicalQuerystring;
    return requestUrl;
}

function addEventHandlers(proto) {

    this.fire = function (type, data) {

        if (this._events && type in this._events) {

            const listeners = this._events[type];

            if(listeners && listeners.length > 0) {

                this._isfiring = true;

                const event = { type: type, target: this };

                const listenerArgs = [event];

                if(arguments.length > 1) {
                    var j, len;
                    for (j = 1, len = arguments.length; j < len; j++) {
                        listenerArgs.push(arguments[j]);
                    }
                }

                for (var i = 0, len = listeners.length; i < len; i++) {
                    var l = listeners[i];
                    l.handler.apply(l.context || this, listenerArgs);
                }

                this._isfiring = false;

            }
        }

        return this;

    };

    this.on = function (type, handler, context) {

        const newListener = this._on(type, handler, context);

        console.log('created listener id [ ' + newListener.id + ' ]')

        return this;
    };

    this._on = function(type, handler, context) {

        this._events = this._events || {};

        var typeListeners;

        if(type in this._events) {
            typeListeners = this._events[type];
        } else {
            typeListeners = [];
            this._events[type] = typeListeners;
        }

        if (context === this) {
    		context = undefined;
    	}

        for (var i = 0, len = typeListeners.length; i < len; i++) {
            if (typeListeners[i].handler === handler && typeListeners[i].context === context) {
                return;
            }
        }

        const newListener = {
            id: newUUID(),
            handler: handler,
            context: context
        };

        typeListeners.push(newListener);

        return newListener;

    };

    // this.once = function(type, handler, context) {
    //
    //     const newListener = this._on(type, handler, context);
    //
    //     console.log('created listener id [ ' + newListener.id + ' ]')
    //
    //     return this;
    //
    //     const removeAfterFire = function() {
    //         this.removeEventListener(type, handler, context);
    //         this.removeEventListener(type + '_fired');
    //     };
    //
    //     this.on(type + '_fired', removeAfterFire, this);
    //
    //
    //
	// 	// var handler = Util.bind(function () {
	// 	// 	this
	// 	// 	    .off(types, fn, context)
	// 	// 	    .off(types, handler, context);
	// 	// }, this);
    //
    //
    //
	// 	// add a listener that's executed once and removed after that
	// 	return this
	// 	    .on(types, fn, context)
	// 	    .on(types, handler, context);
	// };

    this.findListener = function(type, callback, thisArg) {
        if(this._events && callback && typeof callback === 'function')
        {

            const listeners = this._events[type];

            if(listeners && listeners.length > 0) {
                for (i = 0, len = listeners.length; i < len; i++) {
                    if(callback.call(thisArg || this, listeners[i])) {
                        return listeners[i];
                    }
                }
            }
        }
    }

    this.findAllListeners = function(type, callback, thisArg) {

        const foundListeners = [];

        if(this._events && callback && typeof callback === 'function')
        {

            const listeners = this._events[type];

            if(listeners && listeners.length > 0) {
                for (i = 0, len = listeners.length; i < len; i++) {
                    if(callback.call(thisArg || this, listeners[i])) {
                        foundListeners.push(listeners[i]);
                    }
                }
            }
        }

        return foundListeners;

    };

    this.removeEventListener = function(type, listenerToRemove) {

        if(this._events && type && typeof type === 'string') {

            const oldListeners = this._events[type];

            if(oldListeners && Array.isArray(oldListeners) && oldListeners.length > 0) {

                const falseHandler = function() {
                    return false;
                };

                if (listenerToRemove) {

                    const newListeners = oldListeners.slice();

                    if (listenerToRemove.context && listenerToRemove.context === this) {
                        listenerToRemove.context = undefined;
                    }

                    var findListener;

                    if(listenerToRemove.id) {
                        findListener = function(listener) {
                            if(listenerToRemove.id === listener.id) {
                                return true;
                            }
                            return false;
                        }
                    } else if(listenerToRemove.handler) {
                        findListener = function(listener) {
                            if(listenerToRemove.handler === listener.handler) {
                                if(listenerToRemove.context && listenerToRemove.context === l.context) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    } else {
                        findListener = function(listener) {
                            return false;
                        }
                    }

                    for (i = 0, len = newListeners.length; i < len; i++) {

                        const l = listeners[i];

                        if(findListener(l)) {

                            oldListeners[i].handler = falseHandler;

                            newListeners.splice(i, 1);

                        }
                    }

                } else {

                    for (i = 0, len = oldListeners.length; i < len; i++) {

                        oldListeners[i].handler = falseHandler;

                    }

                    delete this._events[type];

                }
            }
        }

        return this;

    };

    this.emit = this.fire;

    return this;

}
