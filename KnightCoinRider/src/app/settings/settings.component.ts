import { Component, OnInit } from '@angular/core';
import { KittAIService } from '../kitt-ai.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [KittAIService]
})
export class SettingsComponent implements OnInit {

  constructor(private kitt: KittAIService) { }

  ngOnInit() {
    this.kitt.kittNavigation();
  }

}
