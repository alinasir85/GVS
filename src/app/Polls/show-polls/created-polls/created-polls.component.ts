import {Component, OnDestroy, OnInit} from '@angular/core';
import {PollModel} from '../../../shared/models/poll.model';
import {Subscription} from 'rxjs';
import {PollService} from '../../../shared/poll.service';
import {AuthService} from '../../../Auth/auth.service';

@Component({
  selector: 'app-created-polls',
  templateUrl: './created-polls.component.html',
  styleUrls: ['./created-polls.component.css']
})
export class CreatedPollsComponent implements OnInit, OnDestroy {
  polls: PollModel[] = [];
  private userID: string;
  subscription: Subscription;
  constructor(private pollService: PollService, private authService: AuthService) { }
  ngOnInit() {
    this.userID = this.authService.getUserId();
    this.pollService.getCreatedPolls(this.userID);
    this.subscription = this.pollService.CreatedpollsDataArrived.subscribe((polls: PollModel[]) => {
      if (this.polls.length !== polls.length) {
        this.polls = polls;
      }
      // console.log(polls);
    });
    setInterval(() => {
    }, 2000);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
