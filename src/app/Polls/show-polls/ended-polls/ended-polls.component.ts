import {Component, OnDestroy, OnInit} from '@angular/core';
import {PollModel} from '../../../shared/models/poll.model';
import {Subscription} from 'rxjs';
import {PollService} from '../../../shared/poll.service';
import {AuthService} from '../../../Auth/auth.service';

@Component({
  selector: 'app-ended-polls',
  templateUrl: './ended-polls.component.html',
  styleUrls: ['./ended-polls.component.css']
})
export class EndedPollsComponent implements OnInit, OnDestroy {
  polls: PollModel[] = [];
  private userID: string;
  subscription: Subscription;
  constructor(private pollService: PollService, private authService: AuthService) { }

  ngOnInit() {
    setInterval(() => {
      this.userID = this.authService.getUserId();
      this.pollService.getCastedVotedPolls(this.userID);
      this.subscription = this.pollService.CastedVotepollsChanged.subscribe((polls: PollModel[]) => {
        if (this.polls.length !== polls.length) {
          this.polls = polls;
        }
      });
    }, 2000);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
