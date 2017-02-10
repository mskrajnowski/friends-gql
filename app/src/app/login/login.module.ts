import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiModule } from '../api'

import { LoginFormComponent } from './login-form/login-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ApiModule,
  ],
  declarations: [
    LoginFormComponent,
  ],
  exports: [
    ApiModule,
    LoginFormComponent,
  ],
})
export class LoginModule { }
