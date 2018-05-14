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
      .map(res => {
        return {
          week: res['data'].Week,
          matchId: res['data'].match.MatchId,
          option: res['data'].Option,
          matchName: res['data'].match.MatchName,
          matchDate: res['data'].match.MatchDate
        }
      });
  }
}




export class Bet {
  week;
  matchId;
  option;
  matchName;
  matchDate;
}
