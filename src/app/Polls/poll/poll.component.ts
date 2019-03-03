import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, SimpleChanges,
  ViewChild
} from '@angular/core';
import {PollModel} from '../../shared/models/poll.model';
import {Router} from '@angular/router';
import {PollService} from '../../shared/poll.service';
import {AuthService} from '../../Auth/auth.service';
import {OptionService} from '../../shared/option.service';
import {NotificationsService} from '../../shared/notifications.service';
import {OptionModel} from '../../shared/models/option.model';
import {NgbAccordion, NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';
import {config} from 'rxjs';

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
  activePolls: PollModel[] = [];
  endedPolls: PollModel[] = [];
  activePoll: string = '';
  constructor(private notificationService: NotificationsService, private router: Router, private pollService: PollService,
              private authService: AuthService, private optionService: OptionService, private config: NgbAccordionConfig) {
  }
  text: any = {
    Year: 'Year',
    Month: 'Month',
    Weeks: 'Weeks',
    Days: 'Days:',
    Hours: 'Hours:',
    Minutes: 'Minutes:',
    Seconds: 'Seconds',
    MilliSeconds: 'MilliSeconds'
  };
  units: any = 'Days | Hours | Minutes | Seconds';
  dateReached(event) {
  }
  getCurrentDate() {
    return new Date();
  }
  Date(date: string) {
    return new Date(date);
  }
  ngOnInit() {
    this.activePoll = String (JSON.parse(localStorage.getItem('activePoll')));
    if(this.acc.isExpanded(this.activePoll)) {
      this.config.type = 'warning';
    }
    this.isCreatedPolls = this.router.url === '/home/showPolls/createdPolls';
  }
  ngOnDestroy(): void {
    this.isCreatedPolls = false;
    localStorage.removeItem('activePoll');
  }
  onDelete(id) {
    this.pollService.deletePoll(id);
  }
  onEdit(poll: PollModel) {
    this.optionService.getOptionsForEdit(poll.id).subscribe((options: OptionModel[]) => {
      localStorage.setItem("poll",JSON.stringify(poll));
      localStorage.setItem("options",JSON.stringify(options));
      this.router.navigate(['home/editPoll']);
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.polls) {
      this.polls.forEach(poll => {
        if(this.getCurrentDate() < new Date(poll.endTime)) {
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
}
