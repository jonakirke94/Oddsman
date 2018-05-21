import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  isLoggedIn: boolean;

  constructor(private _data: AuthService, private router: Router) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      this._data.isLoggedIn().subscribe(isLogged => {
        if (!isLogged) {
          this.router.navigateByUrl('/login');
        }
          this.isLoggedIn = true;
        }).unsubscribe();

      return this.isLoggedIn;
  }
}
