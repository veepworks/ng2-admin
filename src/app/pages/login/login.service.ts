import {Injectable, Inject} from "@angular/core";
import { Utils } from '../../shared/utils';
import { CognitoService } from '../../services/aws-cognito.service';
import { config, CognitoIdentityCredentials, CognitoIdentityServiceProvider } from "aws-sdk";
import { CognitoUserAttribute, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {

    constructor(private cognitoService: CognitoService) { }

    authenticate(email: string, password: string): Observable<boolean>  {
        console.log("UserLoginService: starting the authentication")
        // Need to provide placeholder keys unless unauthorised user access is enabled for user pool
        config.update({accessKeyId: 'anything', secretAccessKey: 'anything'})

        let authenticationData = {
            Username: email,
            Password: password,
        };

        let authenticationDetails: AuthenticationDetails  = new AuthenticationDetails(authenticationData);
        let cognitoUser = this.cognitoService.createCognitoUser(email);

        return new Observable(observer => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    let logins = {};
                    
                    logins['cognito-idp.' + CognitoService._REGION + '.amazonaws.com/' + CognitoService._USER_POOL_ID] = result.getIdToken().getJwtToken();
                    
                    config.credentials = new CognitoIdentityCredentials({
                        IdentityPoolId: CognitoService._IDENTITY_POOL_ID,
                        Logins: logins
                    });
                    
                    console.log("UserLoginService: set the AWS credentials - " + JSON.stringify(config.credentials));

                    observer.next(true);
                    observer.complete();
                },
                onFailure: function (err) {
                    observer.error(err);
                    observer.complete();
                }
            });
        });
    }

}