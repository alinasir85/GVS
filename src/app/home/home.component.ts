import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../Auth/auth.service';
import {UserModel} from '../shared/models/user.model';
import {HttpService} from '../shared/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: UserModel;
  username  = '';
  isToggle = false;
  userID = '';
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private httpService: HttpService) { }

  ngOnInit() {
    this.userID = this.authService.getUserId();
    this.authService.userDetailsChanged.subscribe((user: UserModel) => {
      this.user = user;
      this.username = user.name;
    });
  }
  toggle() {
    this.isToggle = !this.isToggle;
  }
  logOut() {
    this.authService.logOut();
  }
}
