import { Component, OnInit } from '@angular/core';
import { KittAIService } from '../kitt-ai.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [KittAIService]
})
export class SignupComponent implements OnInit {

  constructor(private kitt: KittAIService) { }

  ngOnInit() {
    this.kitt.kittNavigation();
  }

}
