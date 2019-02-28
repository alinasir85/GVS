import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  api = 'https://generalvotingsystem.pythonanywhere.com';
  constructor(private http: HttpClient) { }
  get(url) {
    return this.http.get(this.api + url);
  }
  post(url, data) {
    return this.http.post(this.api + url, data);
  }
  put(url, data) {
    return this.http.put(this.api + url, data);
  }
  delete(url) {
    return this.http.delete(this.api + url);
  }
}
