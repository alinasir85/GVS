import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {OptionModel} from '../../shared/models/option.model';
import {OptionService} from '../../shared/option.service';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../shared/http.service';
import {PollService} from '../../shared/poll.service';
import {ActivatedRoute, Router} from '@angular/router';
import {VoterListModel} from '../../shared/models/voterList.model';
import {PollModel} from '../../shared/models/poll.model';
import swal from 'sweetalert2';
import {AuthService} from '../../Auth/auth.service';



@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.css']
})
export class OptionComponent implements OnInit, OnDestroy {
  @Input() poll: PollModel;
  @Input() pollIndex: number;
  userID = this.authService.getUserId();
  optionForm: FormGroup;
  options: OptionModel[];
  subscription: Subscription;
  isMax = false;
  isCastVotePolls = false;
  votedOptionId = -1;
  isPollEnded = false;
  constructor(private optionService: OptionService, private pollService: PollService, private httpService: HttpService,
              private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.isCastVotePolls = this.router.url === '/home/vote';
    this.optionService.getOptions(this.poll.id);
    this.subscription = this.optionService.OptionsChanged
      .subscribe((options: OptionModel[]) => {
        this.options = options.sort((a, b) => b.voteCount - a.voteCount);
        const max = this.options[0].voteCount;
        this.isMax =  options.filter((obj) => obj.voteCount === max).length <= 1;
      });
    this.initForm();
    if (!this.isCastVotePolls) {
    this.optionService.getVotedOptionID().subscribe((res: VoterListModel[]) => {
      for (let i = 0 ; i < res.length; i++) {
        if (res[i].pollID === this.poll.id && res[i].userID === Number(this.userID)) {
          this.votedOptionId = res[i].optionID;
        }

      }
    });
    }
    if (new Date(this.poll.endTime) < new Date()) {
      this.isPollEnded = true;
    }
  }
  ngOnDestroy(): void {
    this.isCastVotePolls = false;
    this.subscription.unsubscribe();
  }
  initForm() {
    this.optionForm = new FormGroup({
      option: new FormControl('', Validators.required)
    });
  }
  onSubmit() {
    const option: OptionModel = this.optionForm.get('option').value;
    const data = {
      'id': option.id,
      'title': option.title,
      'description': option.description,
      'voteCount': option.voteCount,
      'pollID': option.pollID,
      'userID': this.userID
    };
    this.optionService.castVote(option.pollID, data)
      .subscribe((res) => {
        swal.fire(
          {title: 'Success',
            text: 'Vote Casted!',
            type: 'success',
            allowOutsideClick: false}
        );
        this.pollService.voteCasted(this.pollIndex);
      });
  }
}
