import { Component, OnInit } from '@angular/core';
import {ModalService} from '../../shared/modal.service';
import {ActivatedRoute, NavigationEnd, Route, Router} from '@angular/router';
import {AuthService} from '../../Auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isNavbarCollapsed = true;
  constructor(private modalService: ModalService, private router: Router, private route: ActivatedRoute,
              private authService: AuthService) { }
  isHome = false;
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
      if (event.url.includes('home')) {
        if (this.authService.isAuthenticated()) {this.isHome = true; }
       } else {
         this.isHome = false;
       }
      }
    });
  }
  login() {
    if (this.authService.isAuthenticated())
    {this.router.navigate(['home']); } else {
      this.modalService.triggerLoginModal.next('open');
    }
  }
  logOut() {
    this.authService.logOut();
  }
  profile() {
    this.router.navigate(['home/Profile'], {relativeTo: this.route});
  }
  notifications() {
    this.modalService.triggerNotificationsModal.next('open');
  }

}
