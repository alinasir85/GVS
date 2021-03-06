import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {UserModel} from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  triggerLoginModal = new Subject<string>();
  triggerRegisterModal = new Subject<string>();
  triggerVerifyCodeModal = new Subject<UserModel>();
  triggerNotificationsModal = new Subject<string>();
  emailVerified = new Subject<any>();
  phoneVerified = new Subject<any>();
  verifyCodeForEmail = new Subject<boolean>();
  verifyCodeForPhone = new Subject<boolean>();
  constructor() { }
}
