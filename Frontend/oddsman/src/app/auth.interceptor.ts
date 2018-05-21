import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as moment from 'moment';
import 'rxjs/add/observable/throw';
import { AuthService } from './services/auth.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private _data: AuthService, private http: HttpClient) {}

    private applyCredentials = function (req) {
            return req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('accesstoken'))
            });
    };

    private logout(err) {
        this._data.logout();
        this.router.navigateByUrl('/login');
        return Observable.throw(err);
    }

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {
            return next.handle(this.applyCredentials(req)).catch(err => {
                    if (err instanceof HttpErrorResponse) {
                        // 419 is a special http resonse sent from the server if the request had an expired accesstoken
                        // but a valid refreshtoken still exists on the server
                        if (err.status === 419) {
                            // const token = localStorage.getItem("accesstoken")
                            const body = {
                                accesstoken: localStorage.getItem('accesstoken')
                            };

                            // attempt to refresh the accesstoken
                            return this.http
                              .post(
                                'http://localhost:3000/token/',
                                body
                              )
                              .switchMap(res => {

                                if (!res) {
                                    this.logout(err);
                                }

                                // set result in storage
                                const expiresAt = moment().add(res['data']['refresh_exp'], 'seconds');
                                localStorage.setItem('accesstoken', res['data']['access_token']);
                                localStorage.setItem('refresh_expiresAt', JSON.stringify(expiresAt.valueOf()));

                                // resend request with updated header
                                return next.handle(this.applyCredentials(req));
                            });
                        }

                        // if 401 redirect to login
                        if (err.status === 401) {
                            this.logout(err);
                            this.router.navigateByUrl('/login');
                        }
                    }

                    return Observable.throw(err);
                });
        }

    }
