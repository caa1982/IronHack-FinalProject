import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SessionService } from './session.service'
import 'rxjs/add/operator/map';

@Injectable()
export class BittrexService {
  BASE_URL: string = 'http://localhost:3000';

  constructor(
    private http: Http,
    private SessionService: SessionService
  ) { }

  bittrex(result) {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.SessionService.token });
    let options = new RequestOptions({ headers: headers });
    console.log(result);
    return this.http.post(`${this.BASE_URL}/bittrex`, result, options)
      .map((res) => res.json());

  }
}
