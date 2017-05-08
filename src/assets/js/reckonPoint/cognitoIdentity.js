 var reckonPointApi = reckonPointApi || {};

 reckonPointApi.cognito = reckonPointApi.cognito || {};

reckonPointApi.cognito.setCognitoIdentity = setCognitoIdentity;

reckonPointApi.cognito.addProvider = addProvider;

function setCognitoIdentity(identityPoolId, isRetry)
{
    if(AWS && AWS.config)
    {
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: identityPoolId
        });

        const tryCurrentUser = new Promise(function(resolve, reject) {
            if(reckonPointApi.cognito.userPool)
            {
                const cognitoUser = reckonPointApi.cognito.userPool.getCurrentUser();
                if (cognitoUser && cognitoUser !== null)
                {
                    cognitoUser.getSession(function(err, session) {
                        if (err)
                        {
                            reject(err);
                            return;
                        }
                        resolve(session);
                    });
                }
                else
                {
                    reject(new Error('no cognito user'));
                }
            }
            else
            {
                reject(new Error('no user pool'));
            }
        });

        return tryCurrentUser.then(function(session) {
            const cognitoidpProvider = 'cognito-idp.' + AWS.config.region + '.amazonaws.com/' + reckonPointApi.cognito.userPool.getUserPoolId();
            const cognitoIdentityCredentialsParams = {
                IdentityPoolId: identityPoolId,
                Logins: {}
            }
            addProvider(cognitoidpProvider, session.getIdToken().getJwtToken());
        })
        .catch(function(err) {
            //console.log(err);
            return AWS.config.credentials.getPromise();
        })
        .catch(function(err) {
            console.log(JSON.stringify(err,null,2));
            if(err.code && err.code === 'ResourceNotFoundException')
            {
                AWS.config.credentials.clearCachedId();
                if(!isRetry)
                {
                    setCognitoIdentity(identityPoolId, true);
                }
            }
        });
    }
}

function addProvider(provider, token)
{
    if(AWS && AWS.config && AWS.config.credentials)
    {
        if(AWS.config.credentials.params.Logins)
        {
            AWS.config.credentials.params.Logins[provider] = token;
        }
        else
        {
            AWS.config.credentials.params.Logins = {};
            AWS.config.credentials.params.Logins[provider] = token;
        }
        return AWS.config.credentials.getPromise()
        .then(function() {
            return AWS.config.credentials.refreshPromise();
        });
    }
    else
    {
        return Promise.resolve();
    }
}

function putLastAccess()
{
    if(AWS.CognitoSyncManager)
    {
        AWS.config.credentials.getPromise().
        then(function(){
            var syncClient = new AWS.CognitoSyncManager();
            syncClient.openOrCreateDataset('audit', function(err, dataset) {
                dataset.put('LastAccessDate', new Date().toString(), function(){});
                dataset.put('LastAccessDevice', navigator.userAgent, function(){});
            });
        });
    }
}

function sync(dataset)
{

}
