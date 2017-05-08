import {Component} from '@angular/core';
import {Injectable, Inject} from "@angular/core";
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';
import {RegisterService, RegisterServiceCallback, User} from './register.service';

import 'style-loader!./register.scss';

@Component({
  selector: 'register',
  templateUrl: './register.html',
})
export class Register implements RegisterServiceCallback {

  public form:FormGroup;
  public givenName:AbstractControl;
  public familyName:AbstractControl;
  public email:AbstractControl;
  public password:AbstractControl;
  public repeatPassword:AbstractControl;
  public passwords:FormGroup;

  public submitted:boolean = false;

  constructor(fb:FormBuilder, private service:RegisterService) {

    this.form = fb.group({
      'givenName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'familyName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})
    });

    this.givenName = this.form.controls['givenName'];
    this.familyName = this.form.controls['familyName'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  public onSubmit(values:Object):void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      console.log(values);

      this.service.register({
        givenName: this.givenName.value,
        familyName: this.familyName.value,
        password: this.password.value,
        email: this.email.value
      }, this);
    }
  }

  public cognitoCallback(message: string, result: any):void {

  }
}
