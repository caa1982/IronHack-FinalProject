import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SessionService } from './session.service'
import 'rxjs/add/operator/map';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class SettingsService {

  BASE_URL: string = 'http://localhost:3000';

  constructor(
    private router: Router,
    private http: Http,
    private SessionService: SessionService
  ) { }

  settings(result) {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.SessionService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.BASE_URL}/settings`, result, options )
      .map((res) => res.json());
  }

}
