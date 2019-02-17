import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalService} from '../../shared/modal.service';
import {NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {HttpService} from '../../shared/http.service';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserModel} from '../../shared/models/user.model';
import swal from 'sweetalert2';

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
  verifyCodeForm: FormGroup;
  isLoading = false;
  constructor(private mSrv: ModalService, private modalService: NgbModal, config: NgbModalConfig, private httpService: HttpService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit() {
    this.subscription = this.mSrv.triggerVerifyCodeModal.subscribe((user: UserModel) => {
      this.user = user;
      this.openModal(this.modalRef);
      this.closeReference.result.then(() => {this.verifyCodeForm.reset(); this.isLoading = false; } , () => {this.verifyCodeForm.reset(); this.isLoading = false; });
    });
    this.initForm();
  }
  openModal(content) {
    this.closeReference = this.modalService.open(content, { centered: true });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  verifyCode() {
    this.isLoading = true;
    const data = {
      'email': this.user.email,
      'generateCode': this.verifyCodeForm.value.code,
      'verificationStatus': false
    };
    this.httpService.post('/registration/verifyEmail/', data)
      .subscribe( res => {
        if (res['message'] === 'code verified') {
          const register = {
            'id': null,
            'name': this.user.name,
            'password': this.user.password,
            'phoneNo': this.user.phone,
            'email': res['Email Verification ID']
          };
          this.httpService.post('/registration/registerUser/', register)
            .subscribe( (response) => {
              this.closeReference.close();
              swal.fire(
                {title: 'Success',
                  text: 'Registered!',
                  type: 'success',
                  allowOutsideClick: false}
              );
              this.mSrv.triggerLoginModal.next('open');
            });
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
  initForm() {
    this.verifyCodeForm = new FormGroup({
      'code' : new FormControl(null, Validators.required)
    });
  }
}
