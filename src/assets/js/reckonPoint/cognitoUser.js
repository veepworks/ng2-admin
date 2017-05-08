var reckonPointApi = reckonPointApi || {};

reckonPointApi.cognito = reckonPointApi.cognito || {};

reckonPointApi.cognito.setUserPool = function(poolId, clientId)
{
    var userPoolProps = {
        UserPoolId : poolId,
        ClientId : clientId,
        Paranoia : 8
    };

    reckonPointApi.cognito.userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(userPoolProps);
};

reckonPointApi.cognito.setCognitoUser = function(username, userpool)
{
    var userData = {
        Username : username,
        Pool : userpool || reckonPointApi.cognito.userPool
    };

    reckonPointApi.cognito.cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

};

reckonPointApi.cognito.getCognitoUser = function()
{
    const cognitoUser = reckonPointApi.cognito.userPool.getCurrentUser();

    if (cognitoUser !== null)
    {
        return cognitoUser;
    }
    else
    {
        if(reckonPointApi.cognito.cognitoUser)
        {
            return reckonPointApi.cognito.cognitoUser;
        }
        else
        {
            return null;
        }
    }
};

reckonPointApi.cognito.signOut = function()
{
    const cognitoUser = reckonPointApi.cognito.getCognitoUser();

    if(cognitoUser && cognitoUser !== null)
    {
        cognitoUser.signOut();
    }
};

reckonPointApi.cognito.authenticate = function(username, password)
{
    return new Promise(function(resolve, reject) {
        if(!username || username === null || username === '')
        {
            reject(new Error('username not provided'));
            return;
        }

        if(!password || password === null || password === '')
        {
            reject(new Error('password not provided'));
            return;
        }

        reckonPointApi.cognito.setCognitoUser(username);

        var resultHandler = {
            onSuccess: function (result) {
                var loginProvider = 'cognito-idp.' + AWS.config.region + '.amazonaws.com/' + reckonPointApi.cognito.userPool.getUserPoolId();
                reckonPointApi.cognito.addProvider(loginProvider, result.getIdToken().getJwtToken())
                .then(function() {
                    resolve({
                        success: true
                    });
                })
                .catch(function(err) {
                    reject(err);
                });
            },
            onFailure: function (err) {
                reject(err);
            },
            mfaRequired: function(codeDeliveryDetails) {
               // MFA is required to complete user authentication.
               // Get the code from user and call
               //cognitoUser.sendMFACode(mfaCode, this)
               resolve({
                   mfaRequired: true
               });
               console.log(codeDeliveryDetails);
           },
           newPasswordRequired: function(userAttributes, requiredAttributes) {
               // User was signed up by an admin and must provide new
               // password and required attributes, if any, to complete
               // authentication.
               // Get these details and call
               //cognitoUser.completeNewPasswordChallenge(newPassword, data, this)
               resolve({
                   newPasswordRequired: true
               });
           },
           customChallenge: function() {
               resolve({
                   customChallenge: true
               });
           }
        };

        var authenticationData = {
            Username : username,
            Password : password
        };

        var details = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

        reckonPointApi.cognito.cognitoUser.authenticateUser(details, resultHandler);

    });
};
