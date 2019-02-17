import {Component, OnDestroy, OnInit} from '@angular/core';
import {PollModel} from '../../../shared/models/poll.model';
import {Subscription} from 'rxjs';
import {PollService} from '../../../shared/poll.service';
import {AuthService} from '../../../Auth/auth.service';

@Component({
  selector: 'app-voted-polls',
  templateUrl: './voted-polls.component.html',
  styleUrls: ['./voted-polls.component.css']
})
export class VotedPollsComponent implements OnInit, OnDestroy {
  polls: PollModel[];
  private userID: string;
  subscription: Subscription;
  constructor(private pollService: PollService, private authService: AuthService) { }
  ngOnInit() {
    this.userID = this.authService.getUserId();
    this.pollService.getCastedVotedPolls(this.userID);
    this.subscription = this.pollService.CastedVotepollsChanged.subscribe((polls: PollModel[]) => {
      this.polls = this.pollService.getActiveVotedPolls();
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
