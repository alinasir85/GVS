import { Component, OnInit } from '@angular/core';
import {ModalService} from '../../shared/modal.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import swal from "sweetalert2";
import {HttpService} from '../../shared/http.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  contactForm: FormGroup;
  constructor(private mSrv: ModalService, private httpService: HttpService) { }

  ngOnInit() {
    this.initForm();
  }
  onSignUp() {
    this.mSrv.triggerRegisterModal.next('open');
  }
   initForm() {
    this.contactForm = new FormGroup({
      'name': new FormControl(null, [Validators.required , Validators.pattern(/^[a-zA-Z ]*$/)]),
      'email': new FormControl(null , [Validators.required, Validators.email, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      'message': new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9_ ]*$/)])
    });
   }
   onContactUs() {
    const contact = {'email' : this.contactForm.value.email, 'name': this.contactForm.value.name, 'message': this.contactForm.value.message};
    this.httpService.post(`/registration/contact/`, contact).subscribe(() => {
      swal.fire(
        {title: 'Success',
          text: 'Thank you for the feedback!',
          type: 'success',
          allowOutsideClick: false}
      );
    });
   }

}
