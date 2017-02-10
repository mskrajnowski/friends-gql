import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginModule } from '../login';
import { PeopleModule } from '../people';
import { IsAuthenticatedGuard, AUTHENTICATE_URL } from '../api';

import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleDetailComponent } from './people-detail/people-detail.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [IsAuthenticatedGuard],
    // canActivateChild: [IsAuthenticatedGuard],
    children: [
      {path: 'people', component: PeopleListComponent},
      {path: 'people/:id', component: PeopleDetailComponent},
    ],
  },
  {path: 'login', component: LoginComponent},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    LoginModule,
    PeopleModule,
  ],
  exports: [ RouterModule ],
  declarations: [
    LoginComponent,
    MainComponent,
    NotFoundComponent,
    PeopleListComponent,
    PeopleDetailComponent,
  ],
  providers: [
    {provide: AUTHENTICATE_URL, useValue: '/login'},
  ]
})
export class RoutesModule {}
