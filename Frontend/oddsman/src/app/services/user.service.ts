import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http
      .get("http://localhost:3000/user/")
      .map(res => <User[]> res['data'])
      .shareReplay();
  } 
}

export class User {
  id;
  tag;
  name;
  email;
}

