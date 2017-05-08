import {Injectable, Inject} from "@angular/core";
import { Utils } from '../../shared/utils';
import { CognitoService } from '../../services/aws-cognito.service';
import { config, CognitoIdentityCredentials, CognitoIdentityServiceProvider } from "aws-sdk";
import { CognitoUserAttribute, CognitoUser } from "amazon-cognito-identity-js";

export interface RegisterServiceCallback {
    cognitoCallback(message: string, result: any): void;
}

export interface User {
    username?: string;
    password: string;
    givenName: string;
    familyName: string;
    email: string;
}

@Injectable()
export class RegisterService {

    constructor(@Inject(CognitoService) private cognitoUtil: CognitoService) { }

    register(user: User, callback: RegisterServiceCallback): void {
        console.log("UserRegistrationService: user is " + user);

        let username = Utils.createGuid();

        let attributeList = [];

        let dataEmail = {
            Name: 'email',
            Value: user.email
        };

        let dataGivenName = {
            Name: 'given_name',
            Value: user.givenName
        };
        
        let dataFamilyName = {
            Name: 'family_name',
            Value: user.familyName
        };

        attributeList.push(new CognitoUserAttribute(dataEmail));
        attributeList.push(new CognitoUserAttribute(dataGivenName));
        attributeList.push(new CognitoUserAttribute(dataFamilyName));

        this.cognitoUtil.getUserPool().signUp(user.username, user.password, attributeList, null, function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                console.log("UserRegistrationService: registered user is " + result);
                callback.cognitoCallback(null, result);
            }
        });

    }

    confirmRegistration(username: string, confirmationCode: string, callback: RegisterServiceCallback): void {

        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }

    resendCode(username: string, callback: RegisterServiceCallback): void {
        let userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.resendConfirmationCode(function (err, result) {
            if (err) {
                callback.cognitoCallback(err.message, null);
            } else {
                callback.cognitoCallback(null, result);
            }
        });
    }

}