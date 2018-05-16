import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";


@Injectable()
export class MatchService {

  constructor(private http: HttpClient) { }

  getMissingMatches() {
    return this.http
      .get("http://localhost:3000/match/missing")
      .map(res => <Match[]>res['data'])
      .shareReplay();
  }

  updateMatch(id, match) {
    return this.http.patch(`http://localhost:3000/match/${id}`, match).map(res => res);
  }

  getMissingResults() {
    return this.http
    .get("http://localhost:3000/result/missing")
    .map(res => <Result[]>res['data'])
    .shareReplay();
  }

  updateResult(id, result) {
    return this.http.patch(`http://localhost:3000/result/${id}`, result).map(res => res);
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

export class Result {
  Id?;
  EndResult?;
  CorrectBet?;
}