import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';
let jwtDecode =  require('jwt-decode');

@Injectable()
export class SessionService implements CanActivate {
  public token: string;
  public isAuth: boolean;
  public user: string;

	BASE_URL: string = 'http://localhost:3000';

  constructor(
    private router: Router,
    private http: Http
  ) {
      // set token if saved in local storage
      this.token = localStorage.getItem('token');
      if (this.token != null) {
        this.isAuth = true;
      } else {
        this.isAuth = false;
      }
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('token')) {
      // logged in so return true\
      this.token = localStorage.getItem('token');
      this.user = jwtDecode(this.token).user;
      this.isAuth = true;
      return true;
    }
    // not logged in so redirect to login page
    this.router.navigate(['/login']);
    this.isAuth = false;
    return false;
  }

  isAuthenticated() {
    return this.token != null ? true : false;
  }

  signup(user) {
  	return this.http.post(`${this.BASE_URL}/signup`, user)
  		.map((response) => response.json())
  		.map((response) => {
  			let token = response.token;
  			const user = response.user;
  			if (token) {
          // set token property
          this.token = token;
          this.user = jwtDecode(token).user;
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('token', token );

          this.isAuth = true;
          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
  		})
  		.catch((err) => Observable.throw(err));
  }

  login(user) {
    return this.http.post(`${this.BASE_URL}/login`, user)
        .map((response: Response) => {
            // login successful if there's a jwt token in the response
            let token = response.json() && response.json().token;
            let user = response.json() && response.json().user;

            if (token) {
              // set token property
              this.token = token;
              this.user = jwtDecode(token).user;

              this.isAuth = true;
              // store username and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('token', token );
              localStorage.setItem('user', JSON.stringify(user) );
              // return true to indicate successful login
              return true;
            } else {
              // return false to indicate failed login
              return false;
            }
        });
  }

  logout() {
      // clear token remove user from local storage to log user out
      this.token = null;
      this.user = null;
      this.isAuth = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      this.router.navigate(['/login']);
  }
}
