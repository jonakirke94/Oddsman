import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class OddsService {

  baseUrl:string = "http://localhost:3000/odds"

  constructor(private http: HttpClient) {
  }

  private bets = new BehaviorSubject<any>([]);
  bet = this.bets.asObservable();

  changeBet(bet) {
    this.bets.next(bet);
  }

  sendOdds(tourid, odds) {
    return this.http
    .post(`${this.baseUrl}/${tourid}`, odds)
    .map(res => res);
  }

  getNewestBets() {
    return this.http
      .get(`http://localhost:3000/odds/recent`)
      .map(res =>  res['data']
      )
  }
  

 

  getBets(tourid) {
    return this.http
      .get(`http://localhost:3000/user/bets/${tourid}`)
      .map(res => {
        if(res['data']) {
          return res['data']
        } else {
          return res
        }
         
      })
  }

}




