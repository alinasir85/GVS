import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './Auth/login/login.component';
import {SignupComponent} from './Auth/signup/signup.component';
import {LandingComponent} from './core/landing/landing.component';
import {HomeComponent} from './home/home.component';
import {CreatePollComponent} from './Polls/create-poll/create-poll.component';
import {VoteComponent} from './Polls/vote/vote.component';
import {ShowPollsComponent} from './Polls/show-polls/show-polls.component';
import {VotedPollsComponent} from './Polls/show-polls/voted-polls/voted-polls.component';
import {EndedPollsComponent} from './Polls/show-polls/ended-polls/ended-polls.component';
import {CreatedPollsComponent} from './Polls/show-polls/created-polls/created-polls.component';
import {AuthGuardService} from './Auth/auth-guard.service';
import {ShowProfileComponent} from './home/Profile/show-profile/show-profile.component';
import {NotificationsComponent} from './home/notifications/notifications.component';
const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: SignupComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuardService], canLoad: [AuthGuardService]},
  {path: 'home/Notifications', component: NotificationsComponent, canActivate: [AuthGuardService]},
  {path: 'home/Profile', component: ShowProfileComponent, canActivate: [AuthGuardService]},
  {path: 'home/createPoll', component: CreatePollComponent, canActivate: [AuthGuardService]},
  {path: 'home/editPoll', component: CreatePollComponent, canActivate: [AuthGuardService]},
  {path: 'home/vote', component: VoteComponent, canActivate: [AuthGuardService]},
  {path: 'home/showPolls', component: ShowPollsComponent, children: [
      {path: 'createdPolls', component: CreatedPollsComponent, canActivate: [AuthGuardService]},
      {path: 'activeVotedPolls', component: VotedPollsComponent, canActivate: [AuthGuardService]},
      {path: 'endedPolls', component: EndedPollsComponent, canActivate: [AuthGuardService]}
    ], canActivate: [AuthGuardService]}
  ];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
