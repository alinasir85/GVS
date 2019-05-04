import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PollModel} from '../../shared/models/poll.model';
import {Subscription} from 'rxjs';
import {PollService} from '../../shared/poll.service';
import {AuthService} from '../../Auth/auth.service';
import {NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ModalService} from '../../shared/modal.service';
import {NotificationsModel} from '../../shared/models/notifications.model';
import {computeStyle} from '@angular/animations/browser/src/util';
import {Router} from '@angular/router';
import {NotificationsService} from '../../shared/notifications.service';
import {not} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  notifications: NotificationsModel[] = [];
  subscription: Subscription;
  isDelete = false;
  private userID: string;
  constructor(private mSrv: ModalService, private modalService: NgbModal, config: NgbModalConfig,
              private notificationService: NotificationsService, private authService: AuthService, private router: Router) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit() {
    this.userID = this.authService.getUserId();
    setInterval(() => {
     this.subscription = this.notificationService.getNotifications(this.userID).subscribe((res: NotificationsModel[]) => {
        if (this.notifications.length !== res.length) {
          this.notifications = res;
          for (let i = 0 ; i < this.notifications.length ; i++) {
            if (this.notifications[i].type !== '' || this.notifications[i].pollType !== '') {
              if (this.notifications[i].type === 'pollAdd' || this.notifications[i].pollType === 'castVotePolls') {
                this.notifications[i].message = `Added in Poll ${this.notifications[i].name} !`;
              }
              if (this.notifications[i].type === 'pollStats') {
                this.notifications[i].message = `Poll ${this.notifications[i].name} Ended!`;
              }
              if (this.notifications[i].type === 'pollEnd') {
                this.notifications[i].message = `Poll ${this.notifications[i].name}  is going to end!`;
              }
            }
          }
        }
      });
    }, 2000);
  }

  onClicked(notification: NotificationsModel) {
   // console.log(notification);
    if (notification.type === 'pollAdd' && notification.pollType === 'castVotePolls') {
      localStorage.setItem('activePoll', String(notification.pollId));
      this.router.navigate(['/home/vote']);
    }
    if (notification.type === 'pollAdd' && notification.pollType === 'castedVotePolls') {
      localStorage.setItem('activePoll', String(notification.pollId));
      this.router.navigate(['/home/showPolls/activeVotedPolls']);
    }
    if (notification.type === 'pollAdd' && notification.pollType === 'createdPolls') {
      localStorage.setItem('activePoll', String(notification.pollId));
      this.router.navigate(['/home/showPolls/createdPolls']);
    }
    if (notification.type === 'pollStats' && notification.pollType === 'castedVotePolls') {
      localStorage.setItem('activePoll', String(notification.pollId));
      this.router.navigate(['/home/showPolls/endedPolls']);
    }
    if (notification.type === 'pollStats' && notification.pollType === 'castVotePolls') {
      localStorage.setItem('activePoll', String(notification.pollId));
      this.router.navigate(['/home/showPolls/createdPolls']);
    }
    if (notification.type === 'pollEnd') {
      localStorage.setItem('activePoll', String(notification.pollId));
      this.router.navigate(['/home/vote']);
    }
  }

  onDelete(i) {
    this.notifications.splice(i, 1);
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
