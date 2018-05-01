import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class TournamentService {

  baseUrl:string = "http://localhost:3000/tournament"

  constructor(private http: HttpClient) {
   }

  createTournament(name: string, start: Date, end: Date) {
    return this.http
    .post(`${this.baseUrl}`, {
      name, start, end   
    });
  }

  getAll() {
    return this.http
    .get(`${this.baseUrl}`)
    .map(res => res);
  }

  getUserRequests() {
    return this.http
    .get(`${this.baseUrl}/requests/`)
    .map(res => res);
  }

  getEnrolledTournaments() {
    return this.http
    .get(`${this.baseUrl}/enrolled`)
    .map(res => res);
  }

  getUnEnrolledTournaments() {
    return this.http
    .get(`${this.baseUrl}/unenrolled/`)
    .map(res => res);
  }

  joinTournament(tourid) {
    return this.http
    .post(`${this.baseUrl}/${tourid}/requests/`, {})
    .map(res => res);
  }



 

}
