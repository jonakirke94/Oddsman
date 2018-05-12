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

}
