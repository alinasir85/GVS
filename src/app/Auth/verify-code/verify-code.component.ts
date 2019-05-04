import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalService} from '../../shared/modal.service';
import {NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {HttpService} from '../../shared/http.service';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserModel} from '../../shared/models/user.model';
import swal from 'sweetalert2';
import {modelGroupProvider} from '@angular/forms/src/directives/ng_model_group';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css']
})
export class VerifyCodeComponent implements OnInit, OnDestroy {
  @ViewChild('content')
  private modalRef: TemplateRef<any>;
  private user: UserModel;
  closeReference: NgbModalRef;
  subscription: Subscription;
  subscriptionEmail: Subscription;
  subscriptionPhone: Subscription;
  verifyCodeForm: FormGroup;
  isLoading = false;
  isForEmail = false;
  isForPhone = false;
  constructor(private mSrv: ModalService, private modalService: NgbModal, config: NgbModalConfig, private httpService: HttpService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit() {
    this.isForEmail = false;
    this.isForPhone = false;
    this.subscription = this.mSrv.triggerVerifyCodeModal.subscribe((user: UserModel) => {
      this.user = user;
      this.openModal(this.modalRef);
      this.closeReference.result
        .then(() => {this.verifyCodeForm.reset(); this.isLoading = false; } ,
          () => {this.verifyCodeForm.reset(); this.isLoading = false; });
    });
    this.subscriptionEmail = this.mSrv.verifyCodeForEmail.subscribe( (verify: boolean) => {
      this.isForEmail = verify;
    });
     this.subscriptionPhone = this.mSrv.verifyCodeForPhone.subscribe( (verify: boolean) => {
      this.isForPhone = verify;
    });
    this.initForm();
  }
  openModal(content) {
    this.closeReference = this.modalService.open(content, { centered: true });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscriptionPhone.unsubscribe();
    this.subscriptionEmail.unsubscribe();
  }
  verifyCode() {
    if (this.isForEmail) {
      this.isLoading = true;
      const data = {
        'email': this.user.email,
        'generateCode': this.verifyCodeForm.value.code,
        'verificationStatus': false
      };
      this.httpService.post('/registration/verifyEmail/', data)
        .subscribe( res => {
          if (res['message'] === 'code verified') {
            this.mSrv.emailVerified.next(res['Email Verification ID']);
            this.closeReference.close();
          } else {
            swal.fire(
              {title: 'OOPS',
                text: 'Invalid Code!',
                type: 'error',
                allowOutsideClick: false}
            );
          }
          this.isLoading = false;
          this.verifyCodeForm.reset();
        });
    }
    if (this.isForPhone) {
      this.isLoading = true;
      const data = {
        'phoneNo': this.user.phoneNo,
        'generateCode': this.verifyCodeForm.value.code,
        'verificationStatus': false
      };
      this.httpService.post('/registration/verifyPhoneNo/', data)
        .subscribe( res => {
          if (res['message'] === 'code verified') {
            this.mSrv.phoneVerified.next(res['Phone No Verification ID']);
            this.closeReference.close();
          } else {
            swal.fire(
              {title: 'OOPS',
                text: 'Invalid Code!',
                type: 'error',
                allowOutsideClick: false}
            );
          }
          this.isLoading = false;
          this.verifyCodeForm.reset();
        });
    }
  }
  initForm() {
    this.verifyCodeForm = new FormGroup({
      'code' : new FormControl(null, Validators.required)
    });
  }
}
