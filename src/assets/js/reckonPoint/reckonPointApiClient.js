/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

 var reckonPointApi = reckonPointApi || {};

reckonPointApi.newClient = function (config) {
    if(config === undefined) {
        config = {
            url: 'https://5a9cbij13g.execute-api.us-east-1.amazonaws.com/dev',
            identityPoolId: undefined,
            userPoolId: undefined,
            userPoolClientId: undefined,
            accessKey: undefined,
            secretKey:undefined,
            sessionToken: undefined,
            region: undefined,
            apiKey: undefined,
            authType: 'AWS_IAM',
            defaultContentType: 'application/json',
            defaultAcceptType: 'application/json'
        };
    }
    if(config.accessKey === undefined) {
        config.accessKey = '';
    }
    if(config.secretKey === undefined) {
        config.secretKey = '';
    }
    if(config.apiKey === undefined) {
        config.apiKey = 'XAN1kwqgCP1j8RQHkDnkH5HFsRKAlz2m37v8cmbZ';
    }
    if(config.sessionToken === undefined) {
        config.sessionToken = '';
    }
    if(config.region === undefined) {
        config.region = 'us-east-1';
    }
    //If defaultContentType is not defined then default to application/json
    if(config.defaultContentType === undefined) {
        config.defaultContentType = 'application/json';
    }
    //If defaultAcceptType is not defined then default to application/json
    if(config.defaultAcceptType === undefined) {
        config.defaultAcceptType = 'application/json';
    }
    if(config.url === undefined) {
        config.url = 'https://5a9cbij13g.execute-api.us-east-1.amazonaws.com/dev';
    }
    if(config.identityPoolId === undefined) {
        config.identityPoolId = 'us-east-1:abe99555-0e55-4888-8649-28754bbf45ca';
    }
    if(config.userPoolId === undefined) {
        config.userPoolId = 'us-east-1_lFZCBxtMS';
    }
    if(config.userPoolClientId === undefined) {
        config.userPoolClientId = '6nun8mptq8ln94cffos76em03m';
    }

    if(AWS && AWS.config)
    {
        AWS.config.region = config.region;
    }

    reckonPointApi.cognito.setUserPool(config.userPoolId, config.userPoolClientId);
    reckonPointApi.cognito.setCognitoIdentity(config.identityPoolId);

    // extract endpoint and path from url
    const invokeUrl = config.url;
    const endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
    const pathComponent = invokeUrl.substring(endpoint.length);

    const sigV4ClientConfig = {
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        sessionToken: config.sessionToken,
        serviceName: 'execute-api',
        region: config.region,
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    const authType = config.authType || 'AWS_IAM';
    // if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
    //     authType = 'AWS_IAM';
    // }

    const simpleHttpClientConfig = {
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    const apiGatewayClient = reckonPointApi.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);

    const apigClient = {};


    apigClient.anonymousGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var anonymousGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/anonymous').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(anonymousGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.anonymousOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var anonymousOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/anonymous').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(anonymousOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.authenticatedGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var authenticatedGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/authenticated').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(authenticatedGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.authenticatedOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var authenticatedOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/authenticated').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(authenticatedOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.authenticatedIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var authenticatedIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/authenticated/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(authenticatedIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.authenticatedIdOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);

        var authenticatedIdOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/authenticated/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(authenticatedIdOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.devicesGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var devicesGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/devices').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(devicesGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.devicesPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var devicesPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/devices').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(devicesPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.devicesOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var devicesOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/devices').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(devicesOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.devicesDeviceIdGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['deviceId'], ['body']);

        var devicesDeviceIdGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/devices/{deviceId}').expand(apiGateway.core.utils.parseParametersToObject(params, ['deviceId'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(devicesDeviceIdGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.devicesDeviceIdPut = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['deviceId'], ['body']);

        var devicesDeviceIdPutRequest = {
            verb: 'put'.toUpperCase(),
            path: pathComponent + uritemplate('/devices/{deviceId}').expand(apiGateway.core.utils.parseParametersToObject(params, ['deviceId'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(devicesDeviceIdPutRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.devicesDeviceIdDelete = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['deviceId'], ['body']);

        var devicesDeviceIdDeleteRequest = {
            verb: 'delete'.toUpperCase(),
            path: pathComponent + uritemplate('/devices/{deviceId}').expand(apiGateway.core.utils.parseParametersToObject(params, ['deviceId'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(devicesDeviceIdDeleteRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.devicesDeviceIdOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['deviceId'], ['body']);

        var devicesDeviceIdOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/devices/{deviceId}').expand(apiGateway.core.utils.parseParametersToObject(params, ['deviceId'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(devicesDeviceIdOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.devicesDeviceIdSensordataPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['deviceId'], ['body']);

        var devicesDeviceIdSensordataPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/devices/{deviceId}/sensordata').expand(apiGateway.core.utils.parseParametersToObject(params, ['deviceId'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(devicesDeviceIdSensordataPostRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.devicesDeviceIdSensordataOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, ['deviceId'], ['body']);

        var devicesDeviceIdSensordataOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/devices/{deviceId}/sensordata').expand(apiGateway.core.utils.parseParametersToObject(params, ['deviceId'])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(devicesDeviceIdSensordataOptionsRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.unauthenticatedGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var unauthenticatedGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/unauthenticated').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(unauthenticatedGetRequest, authType, additionalParams, config.apiKey);
    };


    apigClient.unauthenticatedOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }

        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);

        var unauthenticatedOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/unauthenticated').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };


        return apiGatewayClient.makeRequest(unauthenticatedOptionsRequest, authType, additionalParams, config.apiKey);
    };


    return apigClient;
};
