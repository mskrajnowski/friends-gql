import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleDetailComponent } from './people-detail/people-detail.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'login', component: LoginComponent},
  {path: 'people', component: PeopleListComponent},
  {path: 'people/:id', component: PeopleDetailComponent},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: [
    LoginComponent,
    MainComponent,
    NotFoundComponent,
    PeopleListComponent,
    PeopleDetailComponent,
  ],
})
export class RoutesModule {}
