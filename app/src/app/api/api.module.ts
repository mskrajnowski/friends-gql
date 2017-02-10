import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { Auth } from './auth.service';
import { IsAuthenticatedGuard } from './auth.guards';
// import { PROVIDE_STORAGE } from './storage/in-mem';
import { PROVIDE_STORAGE } from './storage/local';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
  ],
  declarations: [],
  providers: [
    PROVIDE_STORAGE,
    Auth,
    IsAuthenticatedGuard,
  ],
})
export class ApiModule { }
