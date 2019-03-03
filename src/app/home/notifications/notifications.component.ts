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

  notifications: NotificationsModel[];
  isDelete = false;
  private userID: string;
  constructor(private mSrv: ModalService, private modalService: NgbModal, config: NgbModalConfig,
              private notificationService: NotificationsService, private authService: AuthService, private router: Router) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit() {
    this.userID = this.authService.getUserId();
    this.notificationService.getNotifications(this.userID).subscribe((res: NotificationsModel[]) => {
      this.notifications = res;
      for(let i=0 ; i < this.notifications.length ; i++) {
        if(this.notifications[i].type === 'pollAdd') {
          this.notifications[i].message = 'Poll Added!'
        }
        if(this.notifications[i].type === 'pollStats') {
          this.notifications[i].message = 'Poll Ended!'
        }
        if(this.notifications[i].type === 'pollEnd') {
          this.notifications[i].message = 'Poll is going to end!'
        }
      }
    });
  }

  onClicked(notification: NotificationsModel) {
    if(notification.type === 'pollAdd') {
      localStorage.setItem('activePoll',String(notification.pollId));
      this.router.navigate(['/home/showPolls/createdPolls']);
    }
    if(notification.type === 'pollStats') {
      this.router.navigate(['/home/showPolls/createdPolls']);
    }
    if(notification.type === 'pollEnd') {
      this.router.navigate(['/home/showPolls/createdPolls']);
    }
  }

  onDelete(i) {
    this.notifications.splice(i,1);
  }
  ngOnDestroy(): void {
  }
}
