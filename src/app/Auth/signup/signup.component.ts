import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalService} from '../../shared/modal.service';
import {NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {from, Subscription} from 'rxjs';
import {HttpService} from '../../shared/http.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import swal from 'sweetalert2';
import {mimeType} from './mime-type.validator';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  @ViewChild('content')
  private modalRef: TemplateRef<any>;
  closeReference: NgbModalRef;
  subscription: Subscription;
  subscriptionEmail: Subscription;
  subscriptionPhone: Subscription;
  registerForm: FormGroup;
  isLoading = false;
  message: string;
  imagePreview;
  isEmailVerified = false;
  isPhoneVerified = false;
  PhoneID;
  EmailID;
  constructor(private mSrv: ModalService, private modalService: NgbModal, config: NgbModalConfig, private httpService: HttpService,
              public afAuth: AngularFireAuth) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit() {
    this.subscription = this.mSrv.triggerRegisterModal.subscribe((status: string) => {
      this.openModal(this.modalRef);
      this.closeReference.result
        .then(() => {this.registerForm.reset(); this.isLoading = false; } ,
          () => {this.registerForm.reset(); this.isLoading = false; });
    });
    this.initForm();
  }
  openModal(content) {
    this.closeReference = this.modalService.open(content, { centered: true });
  }
  Register() {
    if (!this.isEmailVerified) {
      swal.fire(
        {title: 'OOPS',
          text: 'Verify Email!',
          type: 'error',
          allowOutsideClick: false}
      );
    }
    if (!this.isPhoneVerified) {
      swal.fire(
        {title: 'OOPS',
          text: 'Verify Number!',
          type: 'error',
          allowOutsideClick: false}
      );
    } else {
      this.isLoading = true;
      const register = {
        'id': null,
        'name': this.registerForm.getRawValue().name,
        'password': this.registerForm.getRawValue().password,
        'email': this.EmailID,
        'phoneNo': this.PhoneID
      };
      this.httpService.post('/registration/registerUser/', register)
        .subscribe( (response) => {
          swal.fire(
            {title: 'Success',
              text: 'Registered!',
              type: 'success',
              allowOutsideClick: false}
          );
          this.isLoading = false;
          this.isEmailVerified = false;
          this.isPhoneVerified = false;
          this.closeReference.close();
          this.registerForm.controls['phoneNo'].enable();
          this.registerForm.controls['email'].enable();
          this.registerForm.clearValidators();
          this.registerForm.reset();
          this.mSrv.triggerLoginModal.next('open');
        });
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.subscriptionPhone) {this.subscriptionPhone.unsubscribe(); }
    if (this.subscriptionEmail) {this.subscriptionEmail.unsubscribe(); }
  }
  initForm() {
    this.registerForm = new FormGroup({
      'name' : new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]),
      'email' : new FormControl({value: null, disabled: false}, [Validators.required, Validators.email,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      'password' : new FormControl(null, [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9_]*$/)]),
      'phoneNo' : new FormControl({value: null, disabled: false}, [Validators.required, Validators.pattern(/^[0-9]+$/),
        Validators.maxLength(11), Validators.minLength(11)]),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
    });
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const regex = /(.*?)\.(jpg|bmp|jpeg|png)$/;
    if (!regex.test(file.name.toLowerCase())) {
      this.message = 'Not valid image type.';
      this.imagePreview = '';
      return;
    } else {
      this.message = '';
    }
    this.registerForm.patchValue({ image: file });
    this.registerForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <ArrayBuffer> reader.result;
    };
    reader.readAsDataURL(file);
  }
  loginFB() {
    const provider = new auth.FacebookAuthProvider();
    this.afAuth.auth.signInWithPopup(provider)
      .then((user: auth.UserCredential) => {
        this.registerForm.setValue({
          'name': user.user.displayName,
          'email': user.user.email,
          'password': null,
          'phoneNo': user.user.phoneNumber,
          'image': user.user.photoURL
        });
        this.imagePreview = user.user.photoURL;
      });
    this.afAuth.auth.signOut();
  }
  loginG() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then((user: auth.UserCredential) => {
        this.registerForm.setValue({
          'name': user.user.displayName,
          'email': user.user.email,
          'password': null,
          'phoneNo': user.user.phoneNumber,
          'image': user.user.photoURL
        });
        this.imagePreview = user.user.photoURL;
      });
    this.afAuth.auth.signOut();
  }
  verifyEmail() {
    if (this.registerForm.getRawValue().email === null || this.registerForm.getRawValue().email === '') {
      swal.fire(
        {title: 'Email',
          text: 'Cannot verify empty email!',
          type: 'error',
          allowOutsideClick: false}
      );
    } else {
      const dataEmail = {
        'email': this.registerForm.value.email,
        'generateCode': 'new',
        'verificationStatus': false
      };
      this.httpService.post(`/registration/verifyEmail/`, dataEmail)
        .subscribe((res) => {
          if ( res['message'] !== 'Email Already Registered') {
            this.mSrv.triggerVerifyCodeModal.next(this.registerForm.value);
            this.mSrv.verifyCodeForEmail.next(true);
            this.subscriptionEmail = this.mSrv.emailVerified.subscribe((EmailID) => {
              this.isEmailVerified = true;
              this.EmailID = EmailID;
              this.registerForm.controls['email'].disable({onlySelf: true});
            });
          } else {
            swal.fire(
              {title: 'OOPS',
                text: 'Email Already Registered!',
                type: 'error',
                allowOutsideClick: false}
            );
          }
        });
    }
  }
  verifyPhone() {
    if (this.registerForm.getRawValue().phoneNo === null || this.registerForm.getRawValue().phoneNo === '') {
      swal.fire(
        {title: 'Number',
          text: 'Cannot verify empty number!',
          type: 'error',
          allowOutsideClick: false}
      );
    } else {
      const dataPhone = {
        'phoneNo': this.registerForm.value.phoneNo,
        'generateCode': 'new',
        'verificationStatus': false
      };
      this.httpService.post(`/registration/verifyPhoneNo/`, dataPhone)
        .subscribe((res) => {
          if (res['message'] !== 'Phone No Already Registered') {
            this.mSrv.triggerVerifyCodeModal.next(this.registerForm.value);
            this.mSrv.verifyCodeForPhone.next(true);
            this.subscriptionPhone =  this.mSrv.phoneVerified.subscribe((phoneID) => {
              this.isPhoneVerified = true;
              this.PhoneID = phoneID;
              this.registerForm.controls['phoneNo'].disable({onlySelf: true});
            });
          } else {
            swal.fire(
              {title: 'OOPS',
                text: 'Number Already Registered!',
                type: 'error',
                allowOutsideClick: false}
            );
          }
          // this.registerForm.reset();
        });
    }
  }
}

