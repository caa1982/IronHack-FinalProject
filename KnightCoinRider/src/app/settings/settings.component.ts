import { Component, OnInit } from '@angular/core';
import { KittAIService } from '../kitt-ai.service';
import { SettingsService } from '../settings.service';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [KittAIService]
})
export class SettingsComponent implements OnInit {

  userSetting: Object = {};

  constructor(
    private kitt: KittAIService,
    private settings: SettingsService,
    private router: Router
  ) { }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'))
    this.userSetting = user;

    this.kitt.start(' ');
  }

  submit() {
    console.log(this.userSetting)
    this.settings.settings(this.userSetting).subscribe(result => {
      this.userSetting = result.user;
      let newUser = JSON.stringify(result.user)
      localStorage.setItem('user', newUser);
    });
this.router.navigate(['/kitt']);
  }

}
