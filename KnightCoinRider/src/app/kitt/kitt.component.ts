import { Component, OnInit } from '@angular/core';
import { KittAIService } from '../kitt-ai.service';
import { WikipediaService } from '../wikipedia.service';


@Component({
  selector: 'app-kitt',
  templateUrl: './kitt.component.html',
  styleUrls: ['./kitt.component.css'],
  providers: [KittAIService, WikipediaService],
})
export class KittComponent implements OnInit {
  wikiTitle: string;
  wikiArticle: string;

  constructor(
    private kitt: KittAIService,
    private wikipedia: WikipediaService,
  ) { }

  ngOnInit() {
    this.kitt.startMessage();
  }

  kittInput(userInput) {
    if (userInput.value.includes('wiki')) {
      this.wiki(userInput);
    }
  };

  wiki(userInput) {
    console.log(userInput.value);
    const wordSearch = userInput.value.replace('wiki', '').replace('pedia', '');
    this.wikipedia.getWikipediaArticle(wordSearch)
      .subscribe((article) => {
        this.wikiTitle = article.query.pages[Object.keys(article.query.pages).toString()].title;
        this.wikiArticle = article.query.pages[Object.keys(article.query.pages).toString()].extract;
        if (this.wikiArticle.includes('.')) {
          this.wikiArticle = this.wikiArticle.substring(0, this.wikiArticle.indexOf('.'));
        }
        else {
          this.wikiArticle = 'Please search again, it seems your search has no wikipedia entry'
        }
        if ( this.wikiArticle.includes('From other capitalisation')){
          this.wikiArticle = 'Please search again, Names and Surname should start with capital letter'
        }
        this.kitt.wiki(this.wikiArticle);
      });
  }

}
