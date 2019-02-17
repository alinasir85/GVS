import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ModalService} from '../../shared/modal.service';
import {NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {HttpService} from '../../shared/http.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import swal from 'sweetalert2';
import {mimeType} from './mime-type.validator';
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
  registerForm: FormGroup;
  isLoading = false;
  message: string;
  imagePreview;
  constructor(private mSrv: ModalService, private modalService: NgbModal, config: NgbModalConfig, private httpService: HttpService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.subscription = this.mSrv.triggerRegisterModal.subscribe((status: string) => {
      this.openModal(this.modalRef);
      this.closeReference.result.then(() => {this.registerForm.reset(); this.isLoading = false; } , () => {this.registerForm.reset(); this.isLoading = false; });
    });
    this.initForm();
  }
  openModal(content) {
    this.closeReference = this.modalService.open(content, { centered: true });
  }
  Register() {
    this.isLoading = true;
    const data = {
      'email': this.registerForm.value.email,
      'generateCode': 'new',
      'verificationStatus': false
    };
    this.httpService.post(`/registration/verifyEmail/`, data)
      .subscribe((res) => {
        if ( res['message'] !== 'Email Already Registered') {
          this.mSrv.triggerVerifyCodeModal.next(this.registerForm.value);
          this.closeReference.close();
        } else {
          swal.fire(
            {title: 'OOPS',
              text: 'Email Already Registered!',
              type: 'error',
              allowOutsideClick: false}
          );
        }
        this.isLoading = false;
        this.registerForm.reset();
      });

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  initForm() {
    this.registerForm = new FormGroup({
      'name' : new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]),
      'email' : new FormControl(null, [Validators.required, Validators.email,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      'password' : new FormControl(null, [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9_]*$/)]),
      'phone' : new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/),
        Validators.maxLength(11), Validators.minLength(11)]),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
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
    this.registerForm.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <ArrayBuffer> reader.result;
    };
    reader.readAsDataURL(file);
  }
}
