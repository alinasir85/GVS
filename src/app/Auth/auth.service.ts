import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from '../shared/http.service';
import swal from 'sweetalert2';
import {UserModel} from '../shared/models/user.model';

@Injectable()
export class AuthService {
  token: string = localStorage.getItem('user');

  constructor(private router: Router, private httpService: HttpService) {}
  logOut() {
    localStorage.clear();
    this.token = null;
    this.router.navigate(['/']);
  }
  login(data) {
    this.httpService.post(`/registration/verifyUser/`, data)
      .subscribe((res) => {
        if (res['isVerified'] === true) {
          localStorage.setItem('user', res['userID']);
          this.token = res['userID'];
          this.router.navigate(['home']);
        } else {
          swal(
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
