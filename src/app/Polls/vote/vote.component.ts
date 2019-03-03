import {Component, OnDestroy, OnInit} from '@angular/core';
import {PollService} from '../../shared/poll.service';
import {PollModel} from '../../shared/models/poll.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../Auth/auth.service';


@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit, OnDestroy {
  polls: PollModel[] = [];
  private userID: string;
  subscription: Subscription;
  constructor(private pollService: PollService, private authService: AuthService) { }

  ngOnInit() {
    this.userID = this.authService.getUserId();
    this.pollService.getPollsForVote(this.userID);
    this.subscription = this.pollService.pollsForVoteChanged.subscribe((polls: PollModel[]) => {
      for(let poll of polls){
        if(new Date (poll.startTime) < new Date()) {
          this.polls.push(poll);
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
