import { Component, OnInit } from '@angular/core';
import { KittAIService } from '../kitt-ai.service';
import { WikipediaService } from '../wikipedia.service';
import { ExchangesService } from '../exchanges.service';
import { CoinmarketcapService } from '../coinmarketcap.service';
import { PoloniexService } from '../poloniex.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-kitt',
  templateUrl: './kitt.component.html',
  styleUrls: ['./kitt.component.css'],
  providers: [KittAIService, WikipediaService],
})
export class KittComponent implements OnInit {
  color = "green";
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
    private polo: PoloniexService,
    private router: Router
  ) { }

  ngOnInit() {
    this.kitt.start("Welcome, say Help or type help below to see what I can do...");
  }

  poloniex(){
    this.polo.polo(this.trade).subscribe(result => {
      console.log(result)
    })
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
    else {
      let say = "Please check the help page, your input is incorrect!";
      this.kitt.read(say);
    }
  };

  killKitt() {
    if (this.color == "green") {
      this.color = "red";
      this.kitt.killKitt();
    } else {
      this.color = "green";
      this.kitt.start("Hi again, your wish is my command!");;
    }
  }

  checkKitt(say){
    if (this.color == "green") {
      this.kitt.read(say);
    } 
  }

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
      this.checkKitt(say);
    } else {
      let say = "Please check the help page, your input to trade a coin is incorrect!";
      this.checkKitt(say);
    }

  }

  check(userInput) {
    this.showOrder = false;
    this.showWiki = false;
    const ticker = userInput.value.replace('check', '').replace(' ', '')
    this.coinmarketcap.coinmarketcap().subscribe(result => {
      result.forEach(el => {
        if (el.symbol === ticker.toUpperCase() || el.id === ticker || el.name === ticker) {
          this.coin = el;
          this.checkTicker = true;
          this.checkKitt(el.name + ' is trading at an average of ' + el.price_usd + " dollar");
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
        } else {
          this.wikiArticle = 'Please search again, it seems your search has no wikipedia entry'
        }
        if (this.wikiArticle.includes('From other capitalisation')) {
          this.wikiArticle = 'Please search again, Names and Surname should start with capital letter'
        }
        this.checkKitt(this.wikiArticle);
      });
  }

}
