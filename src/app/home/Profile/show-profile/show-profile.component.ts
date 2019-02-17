import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import swal from 'sweetalert2';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-show-profile',
  templateUrl: './show-profile.component.html',
  styleUrls: ['./show-profile.component.css']
})
export class ShowProfileComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  constructor(private httpService: HttpClient) { }

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.registerForm = new FormGroup({
      'name' : new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]),
      'email' : new FormControl({value: user.email, disabled: true}, [Validators.email,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      'password' : new FormControl(user.password, [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9_]*$/)]),
      'phone' : new FormControl({value: null, disabled: true},[Validators.pattern(/^[0-9]+$/),
        Validators.maxLength(11), Validators.minLength(11)])
    });
  }
  update() {
    this.isLoading = true;
    const data = {
      'email': this.registerForm.value.email,
      'generateCode': 'new',
      'verificationStatus': false
    };
    this.httpService.put(``, data)
      .subscribe((res) => {
        swal.fire(
          {title: 'Success',
            text: 'Profile updated!',
            type: 'success',
            allowOutsideClick: false}
        );
        this.isLoading = false;
        this.registerForm.reset();
      });
  }
}
