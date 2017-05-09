import { Injectable, Inject } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate }  from '@angular/router';
import { CognitoService } from "./aws-cognito.service";
import { Observable } from 'rxjs';

import { CognitoUserSession } from "amazon-cognito-identity-js";

@Injectable()
export class AuthService implements CanActivate {

    constructor(private cognitoService: CognitoService, private router: Router) { }
    
    forgotPassword(email: string): Observable<boolean> {

        let cognitoUser = this.cognitoService.createCognitoUser(email);
        let authService = this;

        return new Observable(observer => {
            cognitoUser.forgotPassword({
                onSuccess: function () {
                    observer.next(true);
                    authService.router.navigate(['forgotPassword/createPassword']);
                    observer.complete();
                },
                onFailure: function (err) {
                    observer.error(err);
                    observer.complete();
                },
                inputVerificationCode(data) {
                    observer.next(true);
                    authService.router.navigate(['forgotPassword/createPassword']);
                    observer.complete();
                }
            });
        });
    }
    
    createNewPassword(email: string, verificationCode: string, password: string) {

        let cognitoUser = this.cognitoService.createCognitoUser(email);
        let authService = this;

        return new Observable(observer => {
            cognitoUser.confirmPassword(verificationCode, password, {
                onSuccess: function () {
                    observer.next(true);
                    authService.router.navigate(['login']);
                    observer.complete();
                },
                onFailure: function (err) {
                    observer.error(err);
                    observer.complete();
                }
            });
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {

        let currentUser = this.cognitoService.getCurrentUser();

        return new Observable(observer => {
            if(currentUser == null) {
                console.log("AuthService: current user not found");
                this.router.navigate(['login']);
                observer.next(false);
                observer.complete();
            } else {
                currentUser.getSession(function (err: Error, session: CognitoUserSession) {
                    if(err) {
                        console.log("UserLoginService: Couldn't get the session: " + err, err.stack);
                        observer.error(err);
                    } else {
                        console.log("UserLoginService: Session is " + session.isValid());
                        if(session.isValid()) {
                            observer.next(true);
                        } else {
                            this.router.navigate(['login']);
                            observer.next(false);
                        }
                    }
                    observer.complete();
                });
            }
        });

    }

    logout() {
        console.log("AuthService: signOut");

        let currentUser = this.cognitoService.getCurrentUser();
        if(currentUser != null) {
            currentUser.signOut()
        }
        
    }

}