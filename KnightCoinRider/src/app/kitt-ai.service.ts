import { Injectable, ChangeDetectorRef } from '@angular/core';
import { ArtyomBuilder } from 'artyom.js';
import { Router } from '@angular/router';

@Injectable()
export class KittAIService {
  textToSpeech: '';
  kittCSS: boolean;
  speechToText: '';

  constructor(private router: Router, private ref: ChangeDetectorRef) { }

  // Artyom Settings
  settings(artyom) {

    artyom.initialize({
      lang: 'en-US',
      continuous: true,
      soundex: true,
      debug: true,
      speed: 1,
      listen: true
    });
  }

  // start message
  start() {
    this.kittSay('Welcome, Say help or type help below to see what I can do...', ArtyomBuilder.getInstance());
  }

  // wikipedia read article
  wiki(article) {
    const that = this;
    const artyom = ArtyomBuilder.getInstance();

    this.settings(artyom);

    artyom.say(article, {
      onStart: () => {
        artyom.fatality();
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
    const artyom = ArtyomBuilder.getInstance();

    this.settings(artyom);

    artyom.addCommands({
      description: 'setting',
      indexes: ['settings', 'setting'],
      action: (i) => {
        this.route('settings', artyom);
      }
    });

    artyom.addCommands({
      description: 'login',
      indexes: ['login', 'log in', 'log', 'london', 'looking'],
      action: (i) => {
        this.route('login', artyom);
      }
    });

    artyom.addCommands({
      description: 'signup',
      indexes: ['signup', 'register', 'sign up'],
      action: (i) => {
        this.route('signup', artyom);
      }
    });

  }

  // route the user to a page
  route(page, artyom) {
    artyom.say('Sure lets go to the ' + page + ' page');
    artyom.fatality();
    this.router.navigate(['/' + page]);
  }

  // kitt Listen and reply
  listen() {
    const artyom = ArtyomBuilder.getInstance();
    const that = this;

    this.settings(artyom);

    artyom.addCommands({
      description: 'Test command',
      indexes: ['hello', 'hi'],
      action: (i) => {
        this.kittSay('Hello, cyril! How are you Doing?', artyom);
      }
    });

    artyom.addCommands({
      description: 'Test command',
      indexes: ['one', '1'],
      action: (i) => {
        this.kittSay('please select a coin below?', artyom);
      }
    });

    artyom.addCommands({
      description: 'Test command',
      indexes: ['two', 'to', '2'],
      action: (i) => {
        this.kittSay('please select a coin below?', artyom);
      }
    });

    artyom.addCommands({
      description: 'turn Kitt off',
      indexes: ['stop', 'stuff'],
      action: (i) => {
        this.KittType('you killed KITT!!', artyom);
      }
    });

    artyom.addCommands({
      description: 'buy',
      indexes: ['buy', 'by', 'bye'],
      action: (i) => {
        console.log('buy');
        this.kittSay('Sure, lets buy some coins. Which exchange would you like to buy from? Click on an exchange below', artyom);
      }
    });

    artyom.addCommands({
      description: 'trade',
      indexes: ['trade'],
      action: (i) => {
        console.log('trade');
        this.kittSay('Sure, do you want to Buy or Sell?', artyom);
      }
    });

    artyom.addCommands({
      description: 'sell',
      indexes: ['sell', 'cell', 'so'],
      action: (i) => {
        console.log('sell');
        this.kittSay('Sure, lets sell some coins. Which exchange would you like to sell from? Click on an exchange below', artyom);
      }
    });

    artyom.addCommands({
      description: 'bitcoin',
      indexes: ['bitcoin', 'bitcoins', 'btc', 'bbc', 'big'],
      action: (i) => {
        console.log('bitcoin');
      }
    });
  }

  // kitt only reply via text
  KittType(type, artyom) {
    this.textToSpeech = type;
    artyom.fatality();
  }

  // kitt reply via voice text and audio
  kittSay(say, artyom) {
    const that = this;
    console.log(artyom.getVoices());

    artyom.say(say, {
      onStart: () => {
        artyom.fatality();
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
