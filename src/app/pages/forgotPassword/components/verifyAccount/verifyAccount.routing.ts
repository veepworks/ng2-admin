import { Routes, RouterModule }  from '@angular/router';

import { VerifyAccount } from './verifyAccount.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: VerifyAccount
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
