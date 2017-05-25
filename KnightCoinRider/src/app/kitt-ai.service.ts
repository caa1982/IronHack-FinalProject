import { Injectable, ChangeDetectorRef } from '@angular/core';
import { ArtyomBuilder } from 'artyom.js';
import { Router } from '@angular/router';

@Injectable()
export class KittAIService {
  textToSpeech: '';
  kittCSS: boolean;
  speechToText: '';

  constructor(private router: Router, private ref: ChangeDetectorRef) { }
  artyom: any;

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
    this.artyom = ArtyomBuilder.getInstance();

    this.settings();

    this.artyom.addCommands({
      description: 'setting',
      indexes: ['settings', 'setting'],
      action: (i) => {
        this.route('settings');
      }
    });

    this.artyom.addCommands({
      description: 'dashboard',
      indexes: ['kitt', 'dashboard'],
      action: (i) => {
        this.route('kitt');
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
      description: 'Test command',
      indexes: ['hello', 'hi'],
      action: (i) => {
        this.kittSay('Hello! How are you doing?');
      }
    });

    this.artyom.addCommands({
      description: 'turn Kitt off',
      indexes: ['stop', 'stuff'],
      action: (i) => {
        this.KittType('You killed KITT!!');
      }
    });

    this.artyom.addCommands({
      description: 'buy',
      indexes: ['buy', 'by', 'bye'],
      action: (i) => {
        console.log('buy');
        this.kittSay('Sure, lets buy some coins. Which exchange would you like to buy from? Click on an exchange below');
      }
    });


    this.artyom.addCommands({
      description: 'sell',
      indexes: ['sell', 'cell', 'so'],
      action: (i) => {
        console.log('sell');
        this.kittSay('Sure, lets sell some coins. Which exchange would you like to sell from? Click on an exchange below');
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
    console.log(this.artyom.getVoices());

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
