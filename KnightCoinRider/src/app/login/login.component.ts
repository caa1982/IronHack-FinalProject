import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../session.service';
import { KittAIService } from '../kitt-ai.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [KittAIService]
})
export class LoginComponent implements OnInit {
  user = {
    email: '',
    password: ''
  };

  error: string;
  
  constructor(private router: Router, private kitt: KittAIService, private session: SessionService) { }

  ngOnInit() {
    this.kitt.kittNavigation();
  }

 login() {
    this.session.login(this.user)
				        .subscribe(result => {
				            if (result === true) {
			                // login successful
			                this.router.navigate(['/kitt']);
			         			} else {
			                // login failed
			                this.error = 'Username or password is incorrect';
				            }
				        });
  }


}
