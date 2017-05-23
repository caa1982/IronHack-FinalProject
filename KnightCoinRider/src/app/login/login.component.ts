import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KittAIService } from '../kitt-ai.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [KittAIService]
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private kitt: KittAIService) { }

  ngOnInit() {
    this.kitt.kittNavigation();
  }

  login() {
    this.router.navigate(['kitt']);
  }

}
