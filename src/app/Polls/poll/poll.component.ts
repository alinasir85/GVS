import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, SimpleChanges,
  ViewChild
} from '@angular/core';
import {PollModel} from '../../shared/models/poll.model';
import {NavigationEnd, Router} from '@angular/router';
import {PollService} from '../../shared/poll.service';
import {AuthService} from '../../Auth/auth.service';
import {OptionService} from '../../shared/option.service';
import {NotificationsService} from '../../shared/notifications.service';
import {OptionModel} from '../../shared/models/option.model';
import {NgbAccordion, NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';
import {config} from 'rxjs';
import swal from "sweetalert2";

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css'],
  providers: [NgbAccordionConfig]
})
export class PollComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('acc') private acc: NgbAccordion;
  @Input() polls: PollModel[] = [];
  private isCreatedPolls;
  private isVotePolls;
  activePolls: PollModel[] = [];
  endedPolls: PollModel[] = [];
  activePoll = '';
  constructor(private notificationService: NotificationsService, private router: Router, private pollService: PollService,
              private authService: AuthService, private optionService: OptionService, private config: NgbAccordionConfig) {
  }
  text: any = {
    Year: 'Year',
    Month: 'Month',
    Weeks: 'Weeks',
    Days: 'Days: ',
    Hours: 'Hours: ',
    Minutes: 'Minutes: ',
    Seconds: 'Seconds',
    MilliSeconds: 'MilliSeconds'
  };
  units: any = 'Hours | Minutes | Seconds';
  dateReached(event) {
    const userID = this.authService.getUserId();
    this.pollService.getPollsForVote(userID);
  }
  getCurrentDate() {
    return new Date();
  }
  Date(date: string) {
    return new Date(date);
  }
  ngOnInit() {
    this.activePoll = String (JSON.parse(localStorage.getItem('activePoll')));
    if (this.acc.isExpanded(this.activePoll)) {
      this.config.type = 'warning';
    }
    this.isCreatedPolls = this.router.url === '/home/showPolls/createdPolls';
    this.isVotePolls = this.router.url === '/home/vote';
  }
  ngOnDestroy(): void {
    this.isCreatedPolls = false;
    this.isVotePolls = false;
    localStorage.removeItem('activePoll');
  }
  onDelete(id) {
    swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.pollService.deletePoll(id);
        // const updatedPolls = this.polls.filter(poll => poll.id !== id);
        this.polls.splice(this.polls.findIndex(poll => poll.id === id), 1 );
        // this.pollService.getCreatedPolls(this.authService.getUserId());
        // this.polls = updatedPolls;
        // this.Createdpolls.splice(id,1);
        // this.CreatedpollsDataArrived.next(this.Createdpolls);
      }
    });
  }
  onEdit(poll: PollModel) {
    this.optionService.getOptionsForEdit(poll.id).subscribe((options: OptionModel[]) => {
      localStorage.setItem("poll",JSON.stringify(poll));
      localStorage.setItem("options",JSON.stringify(options));
      this.router.navigate(['home/editPoll']);
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.isCreatedPolls) {
      if (this.polls) {
        this.polls.forEach(poll => {
          if (this.getCurrentDate() < new Date(poll.endTime)) {
            this.activePolls.push(poll);
          } else {
            this.endedPolls.push(poll);
          }
        });
        this.polls = [];
        this.polls.push(...this.activePolls);
        this.polls.push(...this.endedPolls);
        this.acc.activeIds = this.activePoll;
      }
    }
    if(this.isVotePolls) {
      this.acc.activeIds = this.activePoll;
    }
  }
}
