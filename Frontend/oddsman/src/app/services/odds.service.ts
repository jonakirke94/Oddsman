import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class OddsService {

  baseUrl:string = "http://localhost:3000/odds"

  constructor(private http: HttpClient) {
  }

  sendOdds(tourid, odds) {
    return this.http
    .post(`${this.baseUrl}/${tourid}`, odds)
    .map(res => res);
  }

  getBets(tourid) {
    return this.http
      .get(`http://localhost:3000/user/bets/${tourid}`)
      .map(res => res['data']).map(bets => {
        console.log(bets)
        return new Bet(bets.Week, bets.match.MatchId, bets.Option, bets.match.MatchName, bets.match.MatchDate)
      })
  }
}




export class Bet {
  constructor(week, matchId, option, matchName, matchDate) {
    this.week = week;
    this.matchId = matchId;
    this.option = option;
    this.matchName = matchName;
    this.matchDate = matchDate;
  }

  week;
  matchId;
  option;
  matchName;
  matchDate;
}
