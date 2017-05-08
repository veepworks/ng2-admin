import {Component} from '@angular/core';
import {Injectable, Inject} from "@angular/core";
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../../../theme/validators'
import { AuthService } from '../.././../../services/auth.service'
import { Observable } from 'rxjs';

import 'style-loader!./createPassword.scss';

@Component({
  selector: 'createPassword',
  templateUrl: './createPassword.html',
})
export class CreatePassword {

  public form: FormGroup;
  public email:AbstractControl;
  public verificationCode:AbstractControl;
  public password:AbstractControl;
  public repeatPassword:AbstractControl;
  public passwords:FormGroup;
  public submitted: boolean = false;
  
  constructor(fb:FormBuilder, private authService: AuthService) {

    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'verificationCode': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})
    });

    this.email = this.form.controls['email'];
    this.verificationCode = this.form.controls['verificationCode'];
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];

  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      let observable: Observable<boolean> = this.authService.createNewPassword(
        this.email.value,
        this.verificationCode.value,
        this.password.value);

      observable.subscribe(
        result => console.log('CreatePassword result = ' + result),
        error => console.error('CreatePassword error!', error),
        () => console.log('CreatePassword result complete')
      );

    }
  }
}
