import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { ForgotPassword } from './forgotPassword.component';
import { VerifyAccount } from './components/verifyAccount';
import { CreatePassword } from './components/createPassword';
import { routing }       from './forgotPassword.routing';


@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing
  ],
  declarations: [
    ForgotPassword,
    VerifyAccount,
    CreatePassword
  ]
})
export class ForgotPasswordModule {}
