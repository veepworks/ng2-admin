import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import 'style-loader!./verifyAccount.scss';

@Component({
  selector: 'verifyAccount',
  templateUrl: './verifyAccount.html',
})
export class VerifyAccount {

  public form: FormGroup;
  public email: AbstractControl;
  public submitted: boolean = false;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.email])]
    });

    this.email = this.form.controls['email'];

  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      // console.log(values);
    }
  }
}
