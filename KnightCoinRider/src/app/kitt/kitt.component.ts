import { Component, OnInit } from '@angular/core';
import { KittAIService } from '../kitt-ai.service';
import { WikipediaService } from '../wikipedia.service';
import { ExchangesService } from '../exchanges.service';
import { CoinmarketcapService } from '../coinmarketcap.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-kitt',
  templateUrl: './kitt.component.html',
  styleUrls: ['./kitt.component.css'],
  providers: [KittAIService, WikipediaService],
})
export class KittComponent implements OnInit {
  wikiTitle: string;
  wikiArticle: string;
  showOrder: boolean;
  showWiki: boolean;
  checkTicker: boolean;
  coin: object;
  trade = {
    order: '',
    qty: '',
    ticker: '',
    price: '',
    exchange: '',
  }



  constructor(
    private kitt: KittAIService,
    private wikipedia: WikipediaService,
    private exchanges: ExchangesService,
    private coinmarketcap: CoinmarketcapService,
    private router: Router
  ) { }

  ngOnInit() {
    this.kitt.start("Welcome, say Help or type help below to see what I can do...");
    this.exchanges.api();
  }

  kittInput(userInput) {
    if (userInput.value.match("wiki*")) {
      this.wiki(userInput);
    }
    else if (userInput.value.match("buy") || userInput.value.match("sell")) {
      this.trading(userInput);
    }
    else if (userInput.value.match("check")) {
      this.check(userInput);
    }
    else{
      let say = "Please check the help page, your input to trade a coin is incorrect!";
      this.kitt.read(say);
    }
  };

  trading(userInput) {
    
    let input = userInput.value.toLowerCase().split(' ');
    if (input.length === 7) {
      this.trade.order = input[0];
      this.trade.qty = input[1];
      this.trade.ticker = input[2];
      this.trade.price = input[4];
      this.trade.exchange = input[6];
      this.showWiki = false;
      this.checkTicker = false;
      this.showOrder = true;
      let say = "are you sure you want to " + userInput.value + "?";
      this.kitt.read(say);
    } else{
      let say = "Please check the help page, your input to trade a coin is incorrect!";
      this.kitt.read(say);
    }

  }

  check(userInput) {
    this.showOrder = false;
    this.showWiki = false;
    const ticker = userInput.value.replace('check', '').replace(' ', '')
    console.log(ticker)
    this.coinmarketcap.coinmarketcap().subscribe(result => {
      result.forEach(el => {
        if (el.symbol === ticker.toUpperCase() || el.id === ticker || el.name === ticker) {
          this.coin = el;
          console.log(this.coin)
          this.checkTicker = true;
          this.kitt.read(el.name + ' is trading at an average of ' + el.price_usd + " dollar");
        }
      });
    });
  }

  wiki(userInput) {
    this.checkTicker = false;
    this.showOrder = false;
    this.showWiki = true;
    const wordSearch = userInput.value.replace('wiki', '').replace('pedia', '');
    this.wikipedia.getWikipediaArticle(wordSearch)
      .subscribe((article) => {
        this.wikiTitle = article.query.pages[Object.keys(article.query.pages).toString()].title;
        this.wikiArticle = article.query.pages[Object.keys(article.query.pages).toString()].extract;
        if (this.wikiArticle.includes('.')) {
          this.wikiArticle = this.wikiArticle.substring(0, this.wikiArticle.indexOf('.'));
        }else {
          this.wikiArticle = 'Please search again, it seems your search has no wikipedia entry'
        }
        if (this.wikiArticle.includes('From other capitalisation')) {
          this.wikiArticle = 'Please search again, Names and Surname should start with capital letter'
        }
        this.kitt.read(this.wikiArticle);
      });
  }

}
