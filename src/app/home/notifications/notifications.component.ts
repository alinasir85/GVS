import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PollModel} from '../../shared/models/poll.model';
import {Subscription} from 'rxjs';
import {PollService} from '../../shared/poll.service';
import {AuthService} from '../../Auth/auth.service';
import {NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ModalService} from '../../shared/modal.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @ViewChild('content')
  private modalRef: TemplateRef<any>;
  closeReference: NgbModalRef;
  modalSubscription: Subscription;

  polls: PollModel[];
  private userID: string;
  subscription: Subscription;
  constructor(private mSrv: ModalService, private modalService: NgbModal, config: NgbModalConfig,
              private pollService: PollService, private authService: AuthService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit() {
    this.modalSubscription  = this.mSrv.triggerNotificationsModal.subscribe((status: string) => {
      this.openModal(this.modalRef);
      this.closeReference.result.then(() => {} , () => {});
    });

    this.userID = this.authService.getUserId();
    this.pollService.getCastedVotedPolls(this.userID);
    this.subscription = this.pollService.CastedVotepollsChanged.subscribe((polls: PollModel[]) => {
      this.polls = this.pollService.getEndedPoll();
    });
  }
  openModal(content) {
    this.closeReference = this.modalService.open(content, { centered: true });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.modalSubscription.unsubscribe();
  }
}
