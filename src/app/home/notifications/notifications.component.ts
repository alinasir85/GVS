import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PollModel} from '../../shared/models/poll.model';
import {Subscription} from 'rxjs';
import {PollService} from '../../shared/poll.service';
import {AuthService} from '../../Auth/auth.service';
import {NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ModalService} from '../../shared/modal.service';
import {NotificationsModel} from '../../shared/models/notifications.model';
import {computeStyle} from '@angular/animations/browser/src/util';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  notifications: NotificationsModel[];
  private userID: string;
  constructor(private mSrv: ModalService, private modalService: NgbModal, config: NgbModalConfig,
              private pollService: PollService, private authService: AuthService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit() {
    this.userID = this.authService.getUserId();
    this.pollService.getNotifications(this.userID).subscribe((res: NotificationsModel[]) => {
      this.notifications = res;
    });
  }

  ngOnDestroy(): void {
  }
}
