import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import swal from 'sweetalert2';
import {HttpClient} from '@angular/common/http';
import {mimeType} from '../../../Auth/signup/mime-type.validator';
import {AuthService} from '../../../Auth/auth.service';
import {UserModel} from '../../../shared/models/user.model';
import {HttpService} from '../../../shared/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-show-profile',
  templateUrl: './show-profile.component.html',
  styleUrls: ['./show-profile.component.css']
})
export class ShowProfileComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  message: string;
  imagePreview;
  userID: string;
  constructor(private httpService: HttpService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.userID = this.authService.getUserId();
    this.httpService.get(`/registration/getUser/${this.userID}`).subscribe((user: UserModel) => {
      this.registerForm.setValue({'name': user.name, 'email': user.email, 'password': user.password,
        'phoneNo': user.phoneNo, 'image': null});
      //  localStorage.setItem('userDetails',JSON.stringify(user));
    });
    this.imagePreview = '../../../assets/img/icons/profile.png';
  }
  initForm() {
    this.registerForm = new FormGroup({
      'name' : new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]),
      'email' : new FormControl({value: null, disabled: true}, [Validators.email,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      'password' : new FormControl(null, [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9_]*$/)]),
      'phoneNo' : new FormControl({value: null, disabled: true},[Validators.pattern(/^[0-9]+$/),
        Validators.maxLength(11), Validators.minLength(11)]),
      'image': new FormControl('null', {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
  }
  update() {
    this.isLoading = true;
    const user: UserModel = this.registerForm.getRawValue();
    this.httpService.put(`/registration/updateProfile/${this.userID}`, user)
      .subscribe((res) => {
        swal.fire(
          {title: 'Success',
            text: 'Profile updated!',
            type: 'success',
            allowOutsideClick: false}
        );
        this.isLoading = false;
        this.router.navigate(['/home/Dashboard']);
        this.registerForm.reset();
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
      console.log(this.imagePreview);
    };
    reader.readAsDataURL(file);
  }
}
