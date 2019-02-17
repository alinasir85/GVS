import {Component, OnDestroy, OnInit} from '@angular/core';
import {PollService} from '../../shared/poll.service';
import {PollModel} from '../../shared/models/poll.model';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit, OnDestroy {
  polls: PollModel[];
  private userID: string;
  subscription: Subscription;
  constructor(private pollService: PollService) { }

  ngOnInit() {
    this.userID = localStorage.getItem('userID');
    this.pollService.getPollsForVote(this.userID);
    this.subscription = this.pollService.pollsForVoteChanged.subscribe((polls: PollModel[]) => {
      this.polls = polls;
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
