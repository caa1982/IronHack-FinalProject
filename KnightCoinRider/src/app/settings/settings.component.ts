import { Component, OnInit } from '@angular/core';
import { KittAIService } from '../kitt-ai.service';
import { SettingsService } from "../settings.service";
import { SessionService } from "../session.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [KittAIService]
})
export class SettingsComponent implements OnInit {

  userSetting = {
    PoloniexKey: "",
    PoloniexSecret: "",
    BittrexKey: "",
    BittrexSecret: "",
    KrakenKey: "",
    KrakenSecret: ""
  };

  constructor(
    private kitt: KittAIService,
    private settings: SettingsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.kitt.start(" ");
  }

  submit() {
    this.settings.settings(this.userSetting).subscribe(result => {
				            if (result === true) {
			                // login successful
			                console.log(result)
			         			} else {
			                // login failed
			                console.log("error")
				            }
				        });
    this.router.navigate(['/kitt']);
  }

}
