import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class WikipediaService {

  constructor(private http: Http) { }

  getWikipediaArticle(wikiSearch) {
    return this.http.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=
    &explaintext=&titles=${wikiSearch}&format=json`).map((res) => res.json());
  }

}
