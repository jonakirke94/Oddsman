import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TournamentService {



  constructor(private http: HttpClient) { }

  createTournament(name: string, start: Date, end: Date) {
    return this.http
    .post("http://localhost:3000/tournament", {
      name, start, end   
    });
  }

  getAll() {
    return this.http
    .get("http://localhost:3000/tournament")
    .map(res => res);
  }

}
