import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalService} from '../../shared/modal.service';
import {NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../shared/http.service';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {AuthService} from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('content')
  private modalRef: TemplateRef<any>;
  closeReference: NgbModalRef;
  subscription: Subscription;
  loginForm: FormGroup;
  isLoading = false;
  constructor(private mSrv: ModalService, private modalService: NgbModal, config: NgbModalConfig,
              private httpService: HttpService, private router: Router, private authService: AuthService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.subscription  = this.mSrv.triggerLoginModal.subscribe((status: string) => {
      this.openModal(this.modalRef);
      this.closeReference.result.then(() => {this.loginForm.reset(); this.isLoading = false; } , () => {this.loginForm.reset(); this.isLoading = false; });
    });
    this.initForm();
  }
  openModal(content) {
   this.closeReference = this.modalService.open(content, { centered: true });
  }
  Register() {
    this.mSrv.triggerRegisterModal.next('open');
    this.closeReference.close();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  initForm() {
    this.loginForm = new FormGroup({
      'email' : new FormControl(null, [Validators.required,
      Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      'password' : new FormControl(null, [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9_]*$/)])
    });
  }
  login() {
    this.isLoading = true;
    const data = {
      'id': null,
      'loginID': this.loginForm.value.email,
      'password': this.loginForm.value.password,
      'isVerified': false,
      'message': 'Details Matched',
      'userID': null};
   this.authService.login(data);
   this.loginForm.reset();
   this.closeReference.close();
  }
}
