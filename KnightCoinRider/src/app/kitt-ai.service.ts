import { Injectable, ChangeDetectorRef } from '@angular/core';
import { ArtyomBuilder } from 'artyom.js';
import { Router } from '@angular/router';
import { SessionService } from './session.service';

@Injectable()
export class KittAIService {
  kittCSS: boolean;
  textToSpeech: string;
  artyom: any;

  constructor(
    private router: Router,
    private ref: ChangeDetectorRef,
    private session: SessionService
  ) { }

  // Artyom Settings
  settings() {
    this.artyom.initialize({
      lang: 'en-US',
      continuous: true,
      soundex: true,
      debug: true,
      speed: 1,
      listen: true
    });
  }

  // start message
  start(say) {
    this.artyom = ArtyomBuilder.getInstance()
    this.kittSay(say);
    this.kittNavigation();
  }

  // wikipedia read article
  read(say) {
    const that = this;
    this.artyom = ArtyomBuilder.getInstance();

    this.settings();

    this.artyom.say(say, {
      onStart: () => {
        this.artyom.fatality();
        that.kittCSS = true;
        that.ref.detectChanges();
      },
      onEnd: () => {
        that.kittCSS = false;
        that.listen();
      }
    });
  }

  // navigate amoung different components on the Navbar
  kittNavigation() {

    this.artyom.addCommands({
      description: 'setting',
      indexes: ['settings', 'setting'],
      action: (i) => {
        this.route('settings');
      }
    });

    this.artyom.addCommands({
      description: 'help',
      indexes: ['help'],
      action: (i) => {
        this.route('help');
      }
    });

    this.artyom.addCommands({
      description: 'dashboard',
      indexes: ['kitt', 'dashboard'],
      action: (i) => {
        this.route('kitt');
      }
    });

    this.artyom.addCommands({
      description: 'logout',
      indexes: ['logout', 'exit'],
      action: (i) => {
        this.kittSay('See you soon');
        this.session.logout();;
      }
    });

    this.artyom.addCommands({
      description: 'how to trade crypto',
      indexes: ['hello', 'hi'],
      action: (i) => {
        this.kittSay('Hello, lets trade some crypto!');
      }
    });
    
  }

  // route the user to a page
  route(page) {
    this.artyom.say('Sure lets go to the ' + page + ' page');
    this.artyom.fatality();
    this.router.navigate(['/' + page]);
  }

  // kitt Listen and reply
  listen() {
    this.artyom = ArtyomBuilder.getInstance();
    const that = this;

    this.settings();

    this.artyom.addCommands({
      description: 'say hello',
      indexes: ['hello', 'hi'],
      action: (i) => {
        let say = 'Hello sir! How are you doing today? Ready to do some trading';
        this.kittSay(say);
        this.textToSpeech = say;
      }
    });

  }

  //kill kitt
  killKitt() {
    this.KittType('you killed KITT!!');
  }

  // kitt only reply via text
  KittType(type) {
    this.textToSpeech = type;
    this.artyom.fatality();
  }

  // kitt reply via voice text and audio
  kittSay(say) {
    const that = this;

    this.artyom.say(say, {
      onStart: () => {
        this.artyom.fatality();
        that.textToSpeech = say;
        that.kittCSS = true;
        that.ref.detectChanges();
      },
      onEnd: () => {
        that.kittCSS = false;
        that.ref.detectChanges();
        that.listen();
      }
    });

  }


}
