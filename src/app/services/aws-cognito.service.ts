import {Injectable, Inject} from "@angular/core";
import {DynamoDBService} from "./aws-dynamodb.service";
import {Register} from "../pages/register/register.component";
import { Utils } from "../shared";
import { AppConfig } from '../app.config';
import { Observable } from 'rxjs';

import { config, CognitoIdentityCredentials, CognitoIdentityServiceProvider } from "aws-sdk";
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserSession } from "amazon-cognito-identity-js";

/**
 * Created by Vladimir Budilov
 * https://github.com/awslabs/aws-cognito-angular2-quickstart
 * Commit: 181e20f0af0e95a779e176b20f2f2591e5c4feab
 */

//declare var AWSCognito: any;
//declare var AWS: any;

export interface CognitoCallback {
    cognitoCallback(message: string, result: any): void;
}

export interface LoggedInCallback {
    isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface Callback {
    callback(): void;
    callbackWithParam(result: any): void;
}

@Injectable()
export class CognitoService {

    public static _REGION = '';//environment.region;

    public static _IDENTITY_POOL_ID = '';//environment.identityPoolId;
    public static _USER_POOL_ID = '';//environment.userPoolId;
    public static _CLIENT_ID = '';//environment.clientId;

    // public static _POOL_DATA = {
    //     UserPoolId: CognitoUtil._USER_POOL_ID,
    //     ClientId: CognitoUtil._CLIENT_ID
    // };

    private userPool: CognitoUserPool;

    constructor(@Inject(AppConfig) appConfig: AppConfig) {
        console.log('CognitoService created!');

        this.userPool = new CognitoUserPool({
            UserPoolId: appConfig.getAwsConfig().cognitoConfig.userPoolId,
            ClientId: appConfig.getAwsConfig().cognitoConfig.clientId
        });

        console.log('UserPoolId: ' + this.userPool.getUserPoolId());
    }

    // public static getAwsCognito(): any {
    //     return AWSCognito
    // }

    createCognitoUser(username: string): CognitoUser {
        return new CognitoUser({
            Username: username,
            Pool: this.getUserPool()
        });
    }

    getUserPool(): CognitoUserPool {
        //return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(CognitoUtil._POOL_DATA);
        return this.userPool;
    }

    getCurrentUser(): CognitoUser {
        return this.getUserPool().getCurrentUser();
    }


    // getCognitoIdentity(): string {
    //     //return AWS.config.credentials.identityId;
    //     //return config.credentials.
    // }

    getAccessToken(callback: Callback): void {
        if (callback == null) {
            throw("CognitoUtil: callback in getAccessToken is null...returning");
        }
        if (this.getCurrentUser() != null)
            this.getCurrentUser().getSession(function (err, session) {
                if (err) {
                    console.log("CognitoUtil: Can't set the credentials:" + err);
                    callback.callbackWithParam(null);
                }

                else {
                    if (session.isValid()) {
                        callback.callbackWithParam(session.getAccessToken().getJwtToken());
                    }
                }
            });
        else
            callback.callbackWithParam(null);
    }

    getIdToken(callback: Callback): void {
        if (callback == null) {
            throw("CognitoUtil: callback in getIdToken is null...returning");
        }
        if (this.getCurrentUser() != null)
            this.getCurrentUser().getSession(function (err, session) {
                if (err) {
                    console.log("CognitoUtil: Can't set the credentials:" + err);
                    callback.callbackWithParam(null);
                }
                else {
                    if (session.isValid()) {
                        callback.callbackWithParam(session.getIdToken().getJwtToken());
                    } else {
                        console.log("CognitoUtil: Got the id token, but the session isn't valid");
                    }
                }
            });
        else
            callback.callbackWithParam(null);
    }

    getRefreshToken(callback: Callback): void {
        if (callback == null) {
            throw("CognitoUtil: callback in getRefreshToken is null...returning");
        }
        if (this.getCurrentUser() != null)
            this.getCurrentUser().getSession(function (err, session) {
                if (err) {
                    console.log("CognitoUtil: Can't set the credentials:" + err);
                    callback.callbackWithParam(null);
                }

                else {
                    if (session.isValid()) {
                        callback.callbackWithParam(session.getRefreshToken());
                    }
                }
            });
        else
            callback.callbackWithParam(null);
    }

    refresh(): void {
        this.getCurrentUser().getSession(function (err, session) {
            if (err) {
                console.log("CognitoUtil: Can't set the credentials:" + err);
            }

            else {
                if (session.isValid()) {
                    console.log("CognitoUtil: refreshed successfully");
                } else {
                    console.log("CognitoUtil: refreshed but session is still not valid");
                }
            }
        });
    }

    isAuthenticated(): Observable<boolean> {

        let cognitoUser: CognitoUser = this.getCurrentUser();

        return new Observable(observer => {
            if(cognitoUser == null) {
                console.log("CognitoService: can't retrieve the current user");
                observer.next(false);
                observer.complete();
            } else {
                cognitoUser.getSession(function (err: Error, session: CognitoUserSession) {
                    if(err) {
                        console.log("UserLoginService: Couldn't get the session: " + err, err.stack);
                        observer.error(err);
                    } else {
                        console.log("UserLoginService: Session is " + session.isValid());
                        if(session.isValid()) {
                            observer.next(true);
                        } else {
                            observer.next(false);
                        }
                    }
                    observer.complete();
                });
            }
        });
    }
    
}

@Injectable()
export class UserParametersService {

    constructor(public cognitoUtil: CognitoService) {
    }

    getParameters(callback: Callback) {
        let cognitoUser = this.cognitoUtil.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err)
                    console.log("UserParametersService: Couldn't retrieve the user");
                else {
                    cognitoUser.getUserAttributes(function (err, result) {
                        if (err) {
                            console.log("UserParametersService: in getParameters: " + err);
                        } else {
                            callback.callbackWithParam(result);
                        }
                    });
                }

            });
        } else {
            callback.callbackWithParam(null);
        }


    }
}
