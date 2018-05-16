import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";


@Injectable()
export class MatchService {

  constructor(private http: HttpClient) { }

  getMissingMatches() {
    return this.http
      .get("http://localhost:3000/match/missing")
      .map(res => <Match[]> res['data'])
      .shareReplay();
  }

}

export class Match {
  Id?;
  MatchId?;
  MatchName?;
  MatchDate?;
  Option1?;
  Option2?;
  Option3?;
  Option1Odds?;
  Option2Odds?;
  Option3Odds?;
}