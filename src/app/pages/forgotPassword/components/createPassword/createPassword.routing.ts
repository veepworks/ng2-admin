import { Routes, RouterModule }  from '@angular/router';

import { CreatePassword } from './createPassword.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: CreatePassword
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
