import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  toggleNav: false;
  isLoggedin$: Observable<boolean>;
  isAdmin$: Observable<boolean>;


  constructor(private _auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.setHeader();
  }

  private setHeader() {
    const loggedIn = this._auth.isLoggedIn();
    if (loggedIn) {
      this.isLoggedin$ = loggedIn;
    }

    const isAdmin = this._auth.isLoggedAsAdmin();
    if (isAdmin) {
      this.isAdmin$ = isAdmin;
    }

  }

  logout() {
    this._auth.logout();
    this.router.navigateByUrl('/login');
  }

}
