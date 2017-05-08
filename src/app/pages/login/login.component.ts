import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router }  from '@angular/router';
import { LoginService } from './login.service';
import { Observable } from 'rxjs';

import 'style-loader!./login.scss';

@Component({
  selector: 'login',
  templateUrl: './login.html',
})
export class Login {

  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;

  constructor(fb: FormBuilder, private loginService: LoginService, private router: Router) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.email])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
     let observable: Observable<boolean> = this.loginService.authenticate(this.email.value, this.password.value);
      observable.subscribe(
        result => {
          if(result) {
            this.router.navigate(['']);
          }
        },
        error => console.error('Login error!', error),
        () => console.log('Login result complete')
      )
    }
  }
}
