var $jscomp={scope:{}};$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(c.get||c.set)throw new TypeError("ES3 does not support getters and setters.");a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX="jscomp_symbol_";
$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.symbolCounter_=0;$jscomp.Symbol=function(a){return $jscomp.SYMBOL_PREFIX+(a||"")+$jscomp.symbolCounter_++};
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(a){var b=0;return $jscomp.iteratorPrototype(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};$jscomp.array=$jscomp.array||{};$jscomp.iteratorFromArray=function(a,b){$jscomp.initSymbolIterator();a instanceof String&&(a+="");var c=0,e={next:function(){if(c<a.length){var d=c++;return{value:b(d,a[d]),done:!1}}e.next=function(){return{done:!0,value:void 0}};return e.next()}};e[Symbol.iterator]=function(){return e};return e};
$jscomp.polyfill=function(a,b,c,e){if(b){c=$jscomp.global;a=a.split(".");for(e=0;e<a.length-1;e++){var d=a[e];d in c||(c[d]={});c=c[d]}a=a[a.length-1];e=c[a];b=b(e);b!=e&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})}};$jscomp.polyfill("Array.prototype.keys",function(a){return a?a:function(){return $jscomp.iteratorFromArray(this,function(a){return a})}},"es6-impl","es3");var apiGateway=apiGateway||{};apiGateway.core=apiGateway.core||{};
apiGateway.core.apiGatewayClientFactory={};
apiGateway.core.apiGatewayClientFactory.newClient=function(a,b){var c={},e=apiGateway.core.sigV4ClientFactory.newClient(b),d=apiGateway.core.simpleHttpClientFactory.newClient(a);c.makeRequest=function(a,b,g,c){var f=d;void 0!==c&&""!==c&&null!==c&&(a.headers["x-api-key"]=c);if(void 0===a.body||""===a.body||null===a.body||0===Object.keys(a.body).length)a.body=void 0;a.headers=apiGateway.core.utils.mergeInto(a.headers,g.headers);a.queryParams=apiGateway.core.utils.mergeInto(a.queryParams,g.queryParams);
"AWS_IAM"===b&&(f=e);return f.makeRequest(a)};return c};
var apigClientFactory={newClient:function(a){var b={};void 0===a&&(a={accessKey:"",secretKey:"",sessionToken:"",region:"",apiKey:void 0,defaultContentType:"application/json",defaultAcceptType:"application/json"});void 0===a.accessKey&&(a.accessKey="");void 0===a.secretKey&&(a.secretKey="");void 0===a.apiKey&&(a.apiKey="");void 0===a.sessionToken&&(a.sessionToken="");void 0===a.region&&(a.region="us-east-1");void 0===a.defaultContentType&&(a.defaultContentType="application/json");void 0===a.defaultAcceptType&&
(a.defaultAcceptType="application/json");var c=/(^https?:\/\/[^\/]+)/g.exec("https://5a9cbij13g.execute-api.us-east-1.amazonaws.com/dev")[1],e="https://5a9cbij13g.execute-api.us-east-1.amazonaws.com/dev".substring(c.length),d={accessKey:a.accessKey,secretKey:a.secretKey,sessionToken:a.sessionToken,serviceName:"execute-api",region:a.region,endpoint:c,defaultContentType:a.defaultContentType,defaultAcceptType:a.defaultAcceptType},f="NONE";void 0!==d.accessKey&&""!==d.accessKey&&void 0!==d.secretKey&&
""!==d.secretKey&&(f="AWS_IAM");var l=apiGateway.core.apiGatewayClientFactory.newClient({endpoint:c,defaultContentType:a.defaultContentType,defaultAcceptType:a.defaultAcceptType},d);b.anonymousGet=function(b,c,d){void 0===d&&(d={});apiGateway.core.utils.assertParametersDefined(b,[],["body"]);b={verb:"GET",path:e+uritemplate("/anonymous").expand(apiGateway.core.utils.parseParametersToObject(b,[])),headers:apiGateway.core.utils.parseParametersToObject(b,[]),queryParams:apiGateway.core.utils.parseParametersToObject(b,
[]),body:c};return l.makeRequest(b,f,d,a.apiKey)};b.authenticatedGet=function(b,c,d){void 0===d&&(d={});apiGateway.core.utils.assertParametersDefined(b,[],["body"]);b={verb:"GET",path:e+uritemplate("/authenticated").expand(apiGateway.core.utils.parseParametersToObject(b,[])),headers:apiGateway.core.utils.parseParametersToObject(b,[]),queryParams:apiGateway.core.utils.parseParametersToObject(b,[]),body:c};return l.makeRequest(b,f,d,a.apiKey)};b.authenticatedIdGet=function(b,c,d){void 0===d&&(d={});
apiGateway.core.utils.assertParametersDefined(b,[],["body"]);b={verb:"GET",path:e+uritemplate("/authenticated/{id}").expand(apiGateway.core.utils.parseParametersToObject(b,[])),headers:apiGateway.core.utils.parseParametersToObject(b,[]),queryParams:apiGateway.core.utils.parseParametersToObject(b,[]),body:c};return l.makeRequest(b,f,d,a.apiKey)};b.unauthenticatedGet=function(b,c,d){void 0===d&&(d={});apiGateway.core.utils.assertParametersDefined(b,[],["body"]);b={verb:"GET",path:e+uritemplate("/unauthenticated").expand(apiGateway.core.utils.parseParametersToObject(b,
[])),headers:apiGateway.core.utils.parseParametersToObject(b,[]),queryParams:apiGateway.core.utils.parseParametersToObject(b,[]),body:c};return l.makeRequest(b,f,d,a.apiKey)};return b}},apiGateway=apiGateway||{};apiGateway.core=apiGateway.core||{};apiGateway.core.sigV4ClientFactory={};
apiGateway.core.sigV4ClientFactory.newClient=function(a){function b(a,b){return CryptoJS.HmacSHA256(b,a,{asBytes:!0})}function c(a){if(1>Object.keys(a).length)return"";var b=[],c;for(c in a)a.hasOwnProperty(c)&&b.push(c);b.sort();c="";for(var d=0;d<b.length;d++)c+=b[d]+"\x3d"+encodeURIComponent(a[b[d]])+"\x26";return c.substr(0,c.length-1)}function e(a){var b=[],c;for(c in a)a.hasOwnProperty(c)&&b.push(c.toLowerCase());b.sort();return b.join(";")}var d={};if(void 0===a.accessKey||void 0===a.secretKey)return d;
d.accessKey=apiGateway.core.utils.assertDefined(a.accessKey,"accessKey");d.secretKey=apiGateway.core.utils.assertDefined(a.secretKey,"secretKey");d.sessionToken=a.sessionToken;d.serviceName=apiGateway.core.utils.assertDefined(a.serviceName,"serviceName");d.region=apiGateway.core.utils.assertDefined(a.region,"region");d.endpoint=apiGateway.core.utils.assertDefined(a.endpoint,"endpoint");d.makeRequest=function(f){var l=apiGateway.core.utils.assertDefined(f.verb,"verb"),g=apiGateway.core.utils.assertDefined(f.path,
"path"),n=apiGateway.core.utils.copy(f.queryParams);void 0===n&&(n={});var h=apiGateway.core.utils.copy(f.headers);void 0===h&&(h={});void 0===h["Content-Type"]&&(h["Content-Type"]=a.defaultContentType);void 0===h.Accept&&(h.Accept=a.defaultAcceptType);f=apiGateway.core.utils.copy(f.body);f=void 0===f||"GET"===l?"":JSON.stringify(f);""!==f&&void 0!==f&&null!==f||delete h["Content-Type"];var p=(new Date).toISOString().replace(/\.\d{3}Z$/,"Z").replace(/[:\-]|\.\d{3}/g,"");h["x-amz-date"]=p;var m=document.createElement("a");
m.href=d.endpoint;h.host=m.hostname;var k,q=n,m=h,r=f,q=l+"\n"+encodeURI(g)+"\n"+c(q)+"\n",u="",t=[];for(k in m)m.hasOwnProperty(k)&&t.push(k);t.sort();for(k=0;k<t.length;k++)u+=t[k].toLowerCase()+":"+m[t[k]]+"\n";k=q+u+"\n"+e(m)+"\n"+CryptoJS.SHA256(r).toString(CryptoJS.enc.Hex);m=CryptoJS.SHA256(k).toString(CryptoJS.enc.Hex);k=d.region;r=d.serviceName;k=p.substr(0,8)+"/"+k+"/"+r+"/aws4_request";m="AWS4-HMAC-SHA256\n"+p+"\n"+k+"\n"+m;r=d.region;q=d.serviceName;p=b(b(b(b("AWS4"+d.secretKey,p.substr(0,
8)),r),q),"aws4_request");m=b(p,m).toString(CryptoJS.enc.Hex);p=h;k="AWS4-HMAC-SHA256 Credential\x3d"+d.accessKey+"/"+k+", SignedHeaders\x3d"+e(h)+", Signature\x3d"+m;p.Authorization=k;void 0!==d.sessionToken&&""!==d.sessionToken&&(h["x-amz-security-token"]=d.sessionToken);delete h.host;g=a.endpoint+g;n=c(n);""!=n&&(g+="?"+n);void 0===h["Content-Type"]&&(h["Content-Type"]=a.defaultContentType);return axios({method:l,url:g,headers:h,data:f})};return d};apiGateway=apiGateway||{};
apiGateway.core=apiGateway.core||{};apiGateway.core.simpleHttpClientFactory={};
apiGateway.core.simpleHttpClientFactory.newClient=function(a){var b={};b.endpoint=apiGateway.core.utils.assertDefined(a.endpoint,"endpoint");b.makeRequest=function(b){var c=apiGateway.core.utils.assertDefined(b.verb,"verb"),d=apiGateway.core.utils.assertDefined(b.path,"path"),f=apiGateway.core.utils.copy(b.queryParams);void 0===f&&(f={});var l=apiGateway.core.utils.copy(b.headers);void 0===l&&(l={});void 0===l["Content-Type"]&&(l["Content-Type"]=a.defaultContentType);void 0===l.Accept&&(l.Accept=
a.defaultAcceptType);b=apiGateway.core.utils.copy(b.body);void 0===b&&(b="");var d=a.endpoint+d,g;if(1>Object.keys(f).length)g="";else{var n="";for(g in f)f.hasOwnProperty(g)&&(n+=encodeURIComponent(g)+"\x3d"+encodeURIComponent(f[g])+"\x26");g=n.substr(0,n.length-1)}""!=g&&(d+="?"+g);return axios({method:c,url:d,headers:l,data:b})};return b};apiGateway=apiGateway||{};apiGateway.core=apiGateway.core||{};
apiGateway.core.utils={assertDefined:function(a,b){if(void 0===a)throw b+" must be defined";return a},assertParametersDefined:function(a,b,c){if(void 0!==b){0<b.length&&void 0===a&&(a={});for(var e=0;e<b.length;e++)apiGateway.core.utils.contains(c,b[e])||apiGateway.core.utils.assertDefined(a[b[e]],b[e])}},parseParametersToObject:function(a,b){if(void 0===a)return{};for(var c={},e=0;e<b.length;e++)c[b[e]]=a[b[e]];return c},contains:function(a,b){if(void 0===a)return!1;for(var c=a.length;c--;)if(a[c]===
b)return!0;return!1},copy:function(a){if(null==a||"object"!=typeof a)return a;var b=a.constructor(),c;for(c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b},mergeInto:function(a,b){if(null==a||"object"!=typeof a)return a;var c=a.constructor(),e;for(e in a)a.hasOwnProperty(e)&&(c[e]=a[e]);if(null==b||"object"!=typeof b)return a;for(e in b)b.hasOwnProperty(e)&&(c[e]=b[e]);return c}};