import { Component, OnInit } from '@angular/core';
import { KittAIService } from '../kitt-ai.service';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [KittAIService]
})
export class SignupComponent implements OnInit {
  newUser = {
    email: '',
    password: ''
  };

  user: any;
  error: string;

  constructor(
    private kitt: KittAIService,
    private session: SessionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.kitt.kittNavigation();
  }

  signup() {
    this.session.signup(this.newUser)
      .subscribe(result => {
        if (result === true) {
          // login successful
          console.log('result ok', result);
          this.router.navigate(['/settings']);
        } else {
          console.log('result ko', result);
          // login failed
          // this.error = 'Username or password is incorrect';
        }
      });
  }

}
