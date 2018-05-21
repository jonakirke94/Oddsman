import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http
      .get('http://localhost:3000/user/')
      .map(res => <User[]> res['data'])
      .shareReplay();
  }

  updateUser(name, tag, email) {
    return this.http
    .patch('http://localhost:3000/user/', {
        name,
        tag,
        email,
      })
    .map(res => res);
  }
}



