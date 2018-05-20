import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';


@Injectable()
export class AdminguardGuard implements CanActivate {
  isAdmin : boolean;

  constructor(private auth : AuthService, private router : Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
      this.auth.isLoggedIn().subscribe(loggedIn => {
        if(!loggedIn) {
          this.router.navigateByUrl('/login');
        } 

        this.auth.isLoggedAsAdmin().subscribe(isAdmin => {
          if(!isAdmin) {
            this.router.navigateByUrl('/');
          }

          this.isAdmin = true;
        }).unsubscribe();
      }).unsubscribe();

      return this.isAdmin;
  }
}
