import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../.././../../services/auth.service'

import 'style-loader!./verifyAccount.scss';

@Component({
  selector: 'verifyAccount',
  templateUrl: './verifyAccount.html',
})
export class VerifyAccount {

  public form: FormGroup;
  public email: AbstractControl;
  public submitted: boolean = false;

  constructor(fb: FormBuilder, private authService: AuthService) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.email])]
    });

    this.email = this.form.controls['email'];

  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      let observable: Observable<boolean> = this.authService.forgotPassword(this.email.value);
      observable.subscribe(
        result => console.log('VerifyAccount result = ' + result),
        error => console.error('VerifyAccount error!', error),
        () => console.log('VerifyAccount result complete')
      )
    }
  }
}
