import { Component, OnInit } from '@angular/core';
import { KittAIService } from '../kitt-ai.service';
import { WikipediaService } from '../wikipedia.service';
import { CoinmarketcapService } from '../coinmarketcap.service';
import { PoloniexService } from '../poloniex.service';
import { BittrexService } from '../bittrex.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-kitt',
  templateUrl: './kitt.component.html',
  styleUrls: ['./kitt.component.css'],
  providers: [KittAIService, WikipediaService],
})
export class KittComponent implements OnInit {
  color = 'green';
  searchValue: string = null;
  keysGetter = Object.keys;
  wikiTitle: string;
  wikiArticle: string;
  showOrder: boolean;
  showWiki: boolean;
  showTicker: boolean;
  showBalance: boolean;
  showHowCryptoWork: boolean;
  showExecution: boolean;
  showOpenOrders: boolean;
  showOrderBook: boolean;
  showCoins: boolean;
  showTradeHistory: boolean;
  loading: boolean;
  tradesHistory = [];
  tickerOpenOrders = [];
  coin: Object = {};
  exchangeCoins: Object = {};
  exchangeBalance: Object = {};
  orderBook: Object = {};
  executionOrder = {
    order: '',
    amount: '',
    price: '',
    total: '',
  };
  trade = {
    order: '',
    qty: '',
    ticker: '',
    price: '',
    exchange: '',
  }
  InputUserOpenOrders = {
    order: 'open orders',
    ticker: '',
    exchange: '',
  };

  constructor(
    private kitt: KittAIService,
    private wikipedia: WikipediaService,
    private coinmarketcap: CoinmarketcapService,
    private polo: PoloniexService,
    private router: Router,
    private bittrex: BittrexService
  ) { }

  ngOnInit() {
    this.kitt.start('Welcome, say Help or type help below to see what I can do...');
  }

  // look for User Input on the Kitt input box 
  kittInput(userInput) {

    if (userInput.value.match('wiki')) {

      this.wiki(userInput);
      this.searchValue = '';

    } else if (userInput.value.match('buy') || userInput.value.match('sell')) {

      this.trading(userInput);
      this.searchValue = '';

    } else if (userInput.value.match('check')) {

      this.check(userInput);
      this.searchValue = '';

    } else if (userInput.value.match('portfolio')) {

      this.balance(userInput);
      this.searchValue = '';

    } else if (userInput.value.match('open orders')) {

      this.openOrders(userInput);
      this.searchValue = '';

    } else if (userInput.value.match('trade history')) {

      this.tradeHistory(userInput);
      this.searchValue = '';

    } else if (userInput.value.match('order book')) {

      this.oBook(userInput);
      this.searchValue = '';


    } else if (userInput.value.match('coins')) {

      this.coins(userInput);
      this.searchValue = '';

    } else if (userInput.value.match('help')) {

      this.router.navigate(['help/']);
      this.searchValue = '';

    } else if (userInput.value.match('How to trade crypto?')) {

      this.toogle('showHowCryptoWork');
      this.searchValue = '';

    } else {

      this.sayGoToHelpPage();

    }
  };

  //help page message for incorect input 
  sayGoToHelpPage() {
    let say = 'Please check the helpe page, your input was incorrect!';
    this.kitt.textToSpeech = say;
    this.checkKitt(say);
  }

  // toogle all none obesevable div in HTML
  toogle(key) {

    this.showOrder = false;
    this.showWiki = false;
    this.showTicker = false;
    this.showBalance = false;
    this.showExecution = false;
    this.loading = false;
    this.showOpenOrders = false;
    this.showOrderBook = false;
    this.showCoins = false;
    this.showHowCryptoWork = false;

    this[key] = (this[key] == true ? false : true)
  }

  // on/off kitt reply and listen 
  killKitt() {
    let color = 'green';
    if (this.color == 'green') {

      this.color = 'red';
      this.kitt.killKitt();

    } else {

      this.color = 'green';
      this.kitt.start('Hi again, your wish is my command!');

    }
  }

  // check kitt led if green kitt speak
  checkKitt(say) {
    if (this.color == 'green') {
      this.kitt.read(say);
    }
  }

  // return list of coins for selected excahnge
  coins(userInput) {
    this.toogle('loading');

    const input = userInput.value.split(' ');
    const data = { order: 'coins' };

    if (input[1] === 'poloniex') {
      this.polo.polo(data).subscribe(result => {

        for (var key in result) {
          if (result[key].delisted === 1) {
            delete result[key];
          } else {
            let name = result[key].name.split(' ');
            result[key].name = name[0].toLowerCase();
          }
        }
        this.exchangeCoins = result;
        this.toogle('showCoins');
      });
    } else if (input[1] === 'bittrex') {
      let coins = [];

      this.coinmarketcap.coinmarketcap().subscribe(coinMKcap => {
        coins = coinMKcap;
      });

      this.bittrex.bittrex(data).subscribe(result => {

        result.result.forEach(element => {
          coins.forEach(el => {
            if (element.MarketName.replace('BTC', '').replace('-', '') === el.symbol) {
        
              this.exchangeCoins[el.name] = { name: el.id };

            }
          })
        });
      });


      this.toogle('showCoins');

    } else {

      this.sayGoToHelpPage();
      this.toogle(' ');

    };

  }

  // return order book for selected crypto
  oBook(userInput) {
    this.toogle('loading');

    const input = userInput.value.split(' ');
    const data = { order: 'order book', ticker: input[2] }

    if (input[3] === 'poloniex') {

      this.polo.polo(data).subscribe(result => {

        this.orderBook = result;
        this.toogle('showOrderBook');

      });

    } else if (input[3] === 'bittrex') {

      this.bittrex.bittrex(data).subscribe(result => {

        for (var key in result.result.sell) {
          if (Number(key) < 11) {
            result.result.sell[key] = Object.keys(result.result.sell[key]).map(function (key2, index) { return result.result.sell[key][key2]; }).reverse();
            result.result.buy[key] = Object.keys(result.result.buy[key]).map(function (key2, index) { return result.result.buy[key][key2]; }).reverse();
          }
        };

        this.orderBook['asks'] = result.result.sell;
        this.orderBook['bids'] = result.result.buy;

        this.toogle('showOrderBook');

      });

    } else {

      this.sayGoToHelpPage();
      this.toogle(' ');

    };

  }

  // check open orders for selected crypto
  openOrders(userInput) {
    this.toogle('loading');

    const input = userInput.value.split(' ');

    this.InputUserOpenOrders.ticker = input[2];
    this.InputUserOpenOrders.exchange = input[3];

    if (this.InputUserOpenOrders.exchange === 'poloniex') {

      this.polo.polo(this.InputUserOpenOrders).subscribe(result => {

        if (result.length) {
          this.tickerOpenOrders = result;
          this.toogle('showOpenOrders');
        }
        else {
          let say = 'you have no open orders in this crypto';
          this.kitt.textToSpeech = say;
          this.checkKitt(say);
          this.toogle(' ');
        }

      });

    } else if (this.InputUserOpenOrders.exchange === 'bittrex') {

      this.bittrex.bittrex(this.InputUserOpenOrders).subscribe(result => {

        this.tickerOpenOrders = [];

        result.result.forEach(element => {

          let BittrexOpenOrders = {
            orderNumber: element.OrderUuid,
            type: element.OrderType,
            amount: element.Quantity,
            rate: element.Limit,
            date: element.Opened
          };

          this.tickerOpenOrders.push(BittrexOpenOrders);

        });

      });

      this.toogle('showOpenOrders');

    } else {

      this.sayGoToHelpPage();
      this.toogle(' ');

    }

  }

  // check the user trade history
  tradeHistory(userInput) {
    this.toogle('loading');

    const input = userInput.value.split(' ');
    const data = { order: 'trade history', ticker: input[2] };

    if (input[3] === 'poloniex') {

      this.polo.polo(data).subscribe(result => {
        if (result.length) {
          this.tradesHistory = result;
          this.toogle('showTradeHistory');
        }
        else {
          let say = 'It seems you did not trade anything on ' + data.ticker + ' today';
          this.kitt.textToSpeech = say;
          this.checkKitt(say);
          this.toogle(' ');
        }
      });

    } else if (input[3] === 'bittrex') {
      this.bittrex.bittrex(data).subscribe(result => {
        this.toogle('showTradeHistory');
      });
    }
  }

  // cancel order
  cancel(event) {
    this.toogle('loading');

    if (this.InputUserOpenOrders.exchange === 'poloniex') {
      let data = { order: 'cancel order', id: event.target.id };

      this.polo.polo(data).subscribe(result => {

        this.tickerOpenOrders = this.tickerOpenOrders.filter(obj => obj.orderNumber !== data.id);

        let say = 'order was cancel';
        this.kitt.textToSpeech = say;
        this.checkKitt(say);

        this.toogle('showOpenOrders');
      });

    } else if (this.InputUserOpenOrders.exchange === 'bittrex') {
      let data = { order: 'cancel order', id: event.target.id };

      this.bittrex.bittrex(data).subscribe(result => {
        this.tickerOpenOrders = this.tickerOpenOrders.filter(obj => obj.orderNumber !== data.id);
        let say = 'order was cancel';
        this.kitt.textToSpeech = say;
        this.checkKitt(say);

        this.toogle('showOpenOrders');
      })

    }

  }

  // send a sell or buy order to poloniex
  tradePoloniex() {
    this.toogle('loading');

    this.polo.polo(this.trade).subscribe(result => {

      if (typeof result.error !== 'undefined') {
        this.toogle(' ');

        let say = result.error + ' please try again or see the help page for more informations'

        this.kitt.textToSpeech = say;
        this.checkKitt(say);

      }
      else if (result.resultingTrades.length) {
        var amount = 0, total = 0;

        for (var key in result.resultingTrades) {

          amount += Number(result.resultingTrades[key].amount);
          total += Number(result.resultingTrades[key].rate) * Number(result.resultingTrades[key].amount);

        };

        this.executionOrder.order = this.trade.order == 'buy' ? 'bought' : 'sold';
        this.executionOrder.amount = amount.toString();
        this.executionOrder.total = total.toString();
        this.executionOrder.price = (total / amount).toString();

        this.checkKitt('you ' + this.executionOrder.order
          + this.executionOrder.amount + this.trade.ticker + ' @ ' + this.executionOrder.price + ' BTC');

        this.toogle('showExecution');
      }
      else {
        this.toogle(' ');

        let say = 'your order was sent to the exchange please check "open orders" to see details or cancel it';
        this.kitt.textToSpeech = say;
        this.checkKitt(say)

      }
    })
  }

  // send buy or sell order to bittrex
  tradeBittrex() {
    this.toogle('loading');

    this.bittrex.bittrex(this.trade).subscribe(result => {
      if (result.success === false) {
        let say = result.message.replace(/_/g, ' ');
        this.kitt.textToSpeech = say;
        this.checkKitt(say)
        this.toogle(' ');
      }
  
    });

  }

  //sumbmit trade from consfirmation
  submitTrade() {
    if (this.trade.exchange === 'poloniex') {
      this.tradePoloniex();
    } else if (this.trade.exchange === 'bittrex') {
      this.tradeBittrex();
    }
  }

  // check user input for trading and show trading confirmation to html
  trading(userInput) {
    let input = userInput.value.toLowerCase().split(' ');

    if (input.length === 7) {

      this.trade.order = input[0];
      this.trade.qty = input[1];
      this.trade.ticker = input[2];
      this.trade.price = input[4];
      this.trade.exchange = input[6];

      this.toogle('showOrder');

      let say = 'are you sure you want to ' + userInput.value + '?';
      this.checkKitt(say);

    } else {

      this.sayGoToHelpPage();

    }

  }

  // return coinmarketcap info on a specific coin
  check(userInput) {
    const ticker = userInput.value.replace('check', '').replace(' ', '')

    this.coinmarketcap.coinmarketcap().subscribe(result => {

      result.forEach(el => {

        if (el.symbol === ticker.toUpperCase() || el.id === ticker || el.name === ticker) {
          this.coin = el;
          this.toogle('showTicker');
          this.checkKitt(el.name + ' is trading at an average of ' + el.price_usd + ' dollar');

        }

      });

    });
  }

  //check for porfolio exchange balance
  balance(userInput) {
    this.toogle('loading');

    const data = { input: userInput.value.toLowerCase().replace('portfolio', '').replace(' ', '') };

    if (data.input === 'poloniex') {

      this.polo.polo(data).subscribe(result => {

        for (var key in result) {
          if (result[key] == 0) {
            delete result[key];
          }
          else if (result[key] > 1) {
            result[key] = parseFloat(result[key]).toFixed(2);
          }
        }

        this.exchangeBalance = result;
        this.toogle('showBalance');

      });
    } else if (data.input === 'bittrex') {

      this.bittrex.bittrex(data).subscribe(result => {

        result.result.forEach(element => {
          if (element.Balance > 0) {
            this.exchangeBalance[element.Currency] = element.Balance;
          }
        });
        this.toogle('showBalance');
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
        this.toogle('showWiki');

      });
  }

}
