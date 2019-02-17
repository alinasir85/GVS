import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './core/header/header.component';
import { CreatePollComponent } from './Polls/create-poll/create-poll.component';
import { VoteComponent } from './Polls/vote/vote.component';
import { LandingComponent } from './core/landing/landing.component';
import { FooterComponent } from './core/footer/footer.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from './Auth/signup/signup.component';
import { LoginComponent } from './Auth/login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { VerifyCodeComponent } from './Auth/verify-code/verify-code.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PollComponent } from './Polls/poll/poll.component';
import { OptionComponent } from './Polls/option/option.component';
import { ShowPollsComponent } from './Polls/show-polls/show-polls.component';
import { VotedPollsComponent } from './Polls/show-polls/voted-polls/voted-polls.component';
import { EndedPollsComponent } from './Polls/show-polls/ended-polls/ended-polls.component';
import { CreatedPollsComponent } from './Polls/show-polls/created-polls/created-polls.component';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {AuthService} from './Auth/auth.service';
import {AuthGuardService} from './Auth/auth-guard.service';
import {CountDownComponent} from './Polls/Countdown/countdown';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ShowProfileComponent } from './home/Profile/show-profile/show-profile.component';
import { NotificationsComponent } from './home/notifications/notifications.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    CreatePollComponent,
    VoteComponent,
    LandingComponent,
    FooterComponent,
    SignupComponent,
    LoginComponent,
    VerifyCodeComponent,
    PollComponent,
    OptionComponent,
    ShowPollsComponent,
    VotedPollsComponent,
    EndedPollsComponent,
    CreatedPollsComponent,
    CountDownComponent,
    ShowProfileComponent,
    NotificationsComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    BrowserAnimationsModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SweetAlert2Module.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [AuthService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
