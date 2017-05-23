import { Component, OnInit } from '@angular/core';
import { KittAIService } from '../kitt-ai.service';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  providers: [KittAIService]
})
export class LandingPageComponent implements OnInit {

  constructor(private kitt: KittAIService) { }

  ngOnInit() {
      this.kitt.kittNavigation();
  }

  ledSound() {
    const audio = new Audio('/assets/KnightRiderSound.mp3');
    audio.play();
  }

}
