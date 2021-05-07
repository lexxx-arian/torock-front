import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceptMailComponent } from './accept-mail/accept-mail.component';
import { AcceptParticipationComponent } from './accept-participation/accept-participation.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { RegistrationComponent } from './registration/registration.component';
import { StartPageComponent } from './start-page/start-page.component';

const routes: Routes = [
  {
    path: 'start-page',
    component: StartPageComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'event-detail/:id',
    component: EventDetailComponent
  },
  {
    path: 'accept-mail',
    component: AcceptMailComponent
  },
  {
    path: 'accept-participation',
    component: AcceptParticipationComponent
  },
  {
    path: '',
    redirectTo: 'start-page',
    pathMatch: 'full'
  },
  {
    path: 'reg',
    redirectTo: 'registration',
    pathMatch: 'prefix'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
