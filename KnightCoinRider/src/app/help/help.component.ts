import { Component, OnInit } from '@angular/core';
import { KittAIService } from '../kitt-ai.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  providers: [KittAIService]
})
export class HelpComponent implements OnInit {

  constructor( private kitt: KittAIService) { }

  ngOnInit() {
    this.kitt.start(' ');
  }

}
