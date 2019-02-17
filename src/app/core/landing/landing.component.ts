import { Component, OnInit } from '@angular/core';
import {ModalService} from '../../shared/modal.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  contactForm: FormGroup;
  constructor(private mSrv: ModalService) { }

  ngOnInit() {
    this.initForm();
  }
  onSignUp() {
    this.mSrv.triggerRegisterModal.next('open');
  }
   initForm() {
    this.contactForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'email': new FormControl(null , [Validators.required]),
      'message': new FormControl(null, [Validators.required])
    });
   }
}
