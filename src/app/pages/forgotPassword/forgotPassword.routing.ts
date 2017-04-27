import { Routes, RouterModule }  from '@angular/router';

import { ForgotPassword } from './forgotPassword.component';
import { VerifyAccount } from './components/verifyAccount';
import { CreatePassword } from './components/createPassword';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ForgotPassword,
    children: [
      { path: '', redirectTo: 'verifyAccount', pathMatch: 'full' },
      { path: 'verifyAccount', component: VerifyAccount },
      { path: 'createPassword', component: CreatePassword }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
