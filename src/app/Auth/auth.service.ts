import {Injectable, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from '../shared/http.service';
import swal from 'sweetalert2';
import {UserModel} from '../shared/models/user.model';
import {Subject} from 'rxjs';
import {PollModel} from '../shared/models/poll.model';

@Injectable()
export class AuthService {
  userDetailsChanged = new Subject<UserModel>();
  token: string  = localStorage.getItem('user');
  constructor(private router: Router, private httpService: HttpService) {}
  logOut() {
    localStorage.clear();
    this.token = null;
    this.router.navigate(['/']);
  }
  setToken(token: string) {
    this.token = token;
  }
  login(data) {
   this.httpService.post(`/registration/verifyUser/`, data)
     .subscribe((res) => {
     if (res['isVerified'] === true) {
       localStorage.setItem('user', res['userID']);
       // localStorage.setItem('email', res['loginID']);
       this.token = res['userID'];
       this.router.navigate(['home/Dashboard']);
     } else {
       swal.fire(
         {title: 'OOPS',
           text: res['message'],
           type: 'warning',
           allowOutsideClick: false}
       );
     }
   });
  }
  isAuthenticated() {
    return this.token != null;
  }
  getUserId() {
    return this.token;
  }
}
