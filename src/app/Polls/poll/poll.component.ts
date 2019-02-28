import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PollModel} from '../../shared/models/poll.model';
import {Router} from '@angular/router';
import {PollService} from '../../shared/poll.service';
import swal from 'sweetalert2';
import {AuthService} from '../../Auth/auth.service';
import {OptionService} from '../../shared/option.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit, OnDestroy {
  private isCreatedPolls;
  constructor(private router: Router, private pollService: PollService, private authService: AuthService, private optionService: OptionService) { }
  @Input() polls: PollModel[];
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
    this.isCreatedPolls = this.router.url === '/home/showPolls/createdPolls';
  }
  ngOnDestroy(): void {
    this.isCreatedPolls = false;
  }
  onDelete(id) {
    this.pollService.deletePoll(id);
  }
  onEdit(poll: PollModel) {
    this.optionService.getOptions(poll.id);
    this.optionService.OptionsChanged.subscribe(options => {
      const editOptions = options;
      localStorage.setItem("poll",JSON.stringify(poll));
      localStorage.setItem("options",JSON.stringify(options));
      this.router.navigate(['home/editPoll'])
    });
  }
}
