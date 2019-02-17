import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanLoad {
  constructor(private authService: AuthService) {}
canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
return this.authService.isAuthenticated();
}

  canLoad(route: Route, segments: UrlSegment[]) {
    return this.authService.isAuthenticated();
  }
}
