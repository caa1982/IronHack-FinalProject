import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }

  ledSound() {
    const audio = new Audio('/assets/KnightRiderSound.mp3');
    audio.play();
  }

}
