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

  getTournamentRequests(tourId) {
    return this.http
    .get(`${this.baseUrl}/requests/${tourId}`)
    .map(res => <Request[]>res['data']);
  }

  getEnlistedTournaments() {
    return this.http
    .get(`${this.baseUrl}/enlisted`)
    .map(res => res);
  }

  getDelistedTournaments() {
    return this.http
    .get(`${this.baseUrl}/delisted/`)
    .map(res => res);
  }

  joinTournament(tourid) {
    return this.http
    .post(`${this.baseUrl}/${tourid}/requests/`, {})
    .map(res => res);
  }
  
  handleRequest(status, tourId, userId) {
    return this.http
    .post(`${this.baseUrl}/${tourId}/requests/${userId}`, {status: status})
    .map(res => res);
  }
}

export class Request {
  tourId;
  tourName;
  start;
  status;
  userId;
  userName;
  userEmail;
  userTag;
}