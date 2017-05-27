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
  keysGetter = Object.keys;
  wikiTitle: string;
  wikiArticle: string;
  showOrder: boolean;
  showWiki: boolean;
  showTicker: boolean;
  showBalance: boolean;
  showExecution: boolean;
  loading: boolean;
  coin: object;
  exchangeBalance: object;
  executionOrder = {
    order: '',
    amount: '',
    price: '',
    total: ''
  };
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

  // look for User Input on the Kitt input box 
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
    else if (userInput.value.match("portfolio")) {
      this.balance(userInput);
    }
    else {
      let say = "Please check the help page, your input is incorrect!";
      this.kitt.read(say);
    }
  };

  // toogle all none obesevable div in HTML
  toogle(propertyKey) {
    this.showOrder = false;
    this.showWiki = false;
    this.showTicker = false;
    this.showBalance = false;
    this.showExecution = false;
    this.loading = false;
    this[propertyKey] = (this[propertyKey] == true ? false : true)
  }

  // on/off kitt reply 
  killKitt() {
    if (this.color == "green") {
      this.color = "red";
      this.kitt.killKitt();
    } else {
      this.color = "green";
      this.kitt.start("Hi again, your wish is my command!");;
    }
  }

  // check kitt led if green kitt speak
  checkKitt(say) {
    if (this.color == "green") {
      this.kitt.read(say);
    }
  }

  // send a sell or buy order to poloniex
  poloniex() {
    this.toogle("loading");
    this.polo.polo(this.trade).subscribe(result => {
      if(typeof result.error !== "undefined"){
        this.toogle(" ");
        let say = result.error + " please try again or see the help page for more informations"
        this.kitt.textToSpeech = say;
        this.checkKitt(say);
      }
      else if (result.resultingTrades.length) {
        var amount = 0, total = 0;
        for (var key in result.resultingTrades) {
          amount += Number(result.resultingTrades[key].amount);
          total += Number(result.resultingTrades[key].rate) * Number(result.resultingTrades[key].amount);
        };
        this.executionOrder.order = this.trade.order  == "buy" ? "bought" : "sold";
        this.executionOrder.amount = amount.toString();
        this.executionOrder.total = total.toString();
        this.executionOrder.price = (total / amount).toString();
        this.checkKitt("you " + this.executionOrder.order
        + this.executionOrder.amount + this.trade.ticker + " @ " + this.executionOrder.price + " BTC");
        this.toogle("showExecution");
      }
      else {
        this.toogle(" ");
        let say = "your order was sent to the exchange please check 'open orders' to see details or cancel it"
        this.kitt.textToSpeech = say;
        this.checkKitt(say)
       }
    })
  }

  trading(userInput) {

    let input = userInput.value.toLowerCase().split(' ');
    if (input.length === 7) {
      this.trade.order = input[0];
      this.trade.qty = input[1];
      this.trade.ticker = input[2];
      this.trade.price = input[4];
      this.trade.exchange = input[6];
      this.toogle("showOrder");
      let say = "are you sure you want to " + userInput.value + "?";
      this.checkKitt(say);
    } else {
      let say = "Please check the help page, your input to trade a coin is incorrect!";
      this.checkKitt(say);
    }

  }

  // return coinmarketcap info on a specific coin
  check(userInput) {
    const ticker = userInput.value.replace('check', '').replace(' ', '')
    this.coinmarketcap.coinmarketcap().subscribe(result => {
      result.forEach(el => {
        if (el.symbol === ticker.toUpperCase() || el.id === ticker || el.name === ticker) {
          this.coin = el;
          this.toogle("showTicker");
          this.checkKitt(el.name + ' is trading at an average of ' + el.price_usd + " dollar");
        }
      });
    });
  }

  //check for porfolio exchange balance
  balance(userInput) {
    this.toogle("loading");
    const input = { ticker: userInput.value.toLowerCase().replace('portfolio', '').replace(' ', '') };
    if (input.ticker === "poloniex") {
      this.polo.polo(input).subscribe(result => {
        for (var key in result) {
          if (result[key] == 0) {
            delete result[key];
          }
          else if (result[key] > 1) {
            result[key] = parseFloat(result[key]).toFixed(2);
          }
        }
        this.exchangeBalance = result;
        this.toogle("showBalance");
      });
    }
  }

  // check for wikipedia entry
  wiki(userInput) {
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
        this.toogle("showWiki");
      });
  }

}
