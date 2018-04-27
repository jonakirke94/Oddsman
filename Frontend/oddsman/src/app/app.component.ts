import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  
  toggleNav: false;
  isLoggedin$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private _auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setHeader();
  }

  private setHeader() {
    if (this._auth.isLoggedIn()) {
      this.isLoggedin$ = this._auth.isLoggedIn();
    }
  }

  logout() {
    this._auth.logout();
    this.router.navigateByUrl("/login");
  }
}
