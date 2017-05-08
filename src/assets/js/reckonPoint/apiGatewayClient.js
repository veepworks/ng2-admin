
var reckonPointApi = reckonPointApi || {};
reckonPointApi.core = reckonPointApi.core || {};

reckonPointApi.core.apiGatewayClientFactory = {};
reckonPointApi.core.apiGatewayClientFactory.newClient = function (simpleHttpClientConfig, sigV4ClientConfig) {
    var apiGatewayClient = { };
    //Spin up 2 httpClients, one for simple requests, one for SigV4
    var sigV4Client = apiGateway.core.sigV4ClientFactory.newClient(sigV4ClientConfig);
    var simpleHttpClient = apiGateway.core.simpleHttpClientFactory.newClient(simpleHttpClientConfig);
    var region = sigV4ClientConfig.region || 'us-east-1';

    apiGatewayClient.makeRequest = function (request, authType, additionalParams, apiKey) {

        //Attach the apiKey to the headers request if one was provided
        if (apiKey !== undefined && apiKey !== '' && apiKey !== null) {
            request.headers['x-api-key'] = apiKey;
        }

        if (request.body === undefined || request.body === '' || request.body === null || Object.keys(request.body).length === 0) {
            request.body = undefined;
        }

        // If the user specified any additional headers or query params that may not have been modeled
        // merge them into the appropriate request properties
        request.headers = apiGateway.core.utils.mergeInto(request.headers, additionalParams.headers);
        request.queryParams = apiGateway.core.utils.mergeInto(request.queryParams, additionalParams.queryParams);

        //If an auth type was specified inject the appropriate auth client
        if (authType === 'AWS_IAM') {
            return Promise.resolve()
            .then(function() {
                if(AWS.config.credentials && AWS.config.credentials.getPromise)
                {
                    //AWS.config.region = region;
                    return AWS.config.credentials.getPromise();
                }
            })
            .then(function() {
                sigV4Client.accessKey = AWS.config.credentials.accessKeyId;
                sigV4Client.secretKey = AWS.config.credentials.secretAccessKey;
                sigV4Client.sessionToken = AWS.config.credentials.sessionToken;
                //sigV4Client.region = 'us-east-1';
                return sigV4Client.makeRequest(request);
            });
        } else {
            //Default, Call the simple http client to make the request, returning a promise once the request is sent
            return simpleHttpClient.makeRequest(request);
        }

    };
    return apiGatewayClient;
};
