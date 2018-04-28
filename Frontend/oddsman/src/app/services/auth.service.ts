import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/do";
import "rxjs/add/operator/shareReplay";
import * as moment from "moment";
import { CurrentUser } from "../models/currentUser"
import { JwtHelperService } from '@auth0/angular-jwt';



@Injectable()
export class AuthService {
  
  private email: string;
  loggedIn = new BehaviorSubject<boolean>(false);
  isAdmin = new BehaviorSubject<boolean>(false);
  login$;

  constructor(private http: HttpClient) {}

  ngOnDestroy() {
    //unsubscribe to prevent memory leaks
    if(this.login$ && this.login$ !== "undefined") {
      this.login$.unsubscribe();
    }
  }

  login(email: string, password: string) {
    this.logout();

    return this.http
      .post("http://localhost:3000/user/login", {
        email,
        password
      })
      .do(res => {
        this.setSession(res, email);
        this.loggedIn.next(true);
      })
      .shareReplay();
  }



  signup(name: string, tag: string, email: string, password: string) {
    return this.http
      .post("http://localhost:3000/user/signup", {
        name,
        tag,
        email,
        password
      })
      .do(res => {
        this.login(email, password);
      })
      .shareReplay();
  }

  private setSession(authResult, email) {
    //the user is logged in as long as a valid refreshtoken exists on the server
    const expiresAt = moment().add(authResult.data.refresh_exp, "seconds");
    localStorage.setItem("accesstoken", authResult.data.access_token);
    localStorage.setItem("refresh_expiresAt", JSON.stringify(expiresAt.valueOf()));

    authResult.data.isAdmin ? this.isAdmin.next(true) : this.isAdmin.next(false);

    let authInfo = new CurrentUser(email);
    localStorage.setItem("authInfo", JSON.stringify(authInfo));
  }

  logout() {
    this.loggedIn.next(false);
    this.isAdmin.next(false);
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refresh_expiresAt");
    localStorage.removeItem("authInfo");
  }

  public isLoggedIn() {
    //do some testing here.
    const IsValid = moment().isBefore(this.getExpiration());
    IsValid ? this.loggedIn.next(true) : this.loggedIn.next(false);
    return this.loggedIn.asObservable();
  }

   public isLoggedAsAdmin() {
    const access_token = localStorage.getItem("accesstoken");

    if(access_token) {
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(access_token);
        decodedToken.isAdmin === 0 ? this.isAdmin.next(false) : this.isAdmin.next(true);
    } else {
      this.isAdmin.next(false);
    }
    return this.isAdmin.asObservable();
  }
 
  getExpiration() {
    const expiration = localStorage.getItem("refresh_expiresAt");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

}
