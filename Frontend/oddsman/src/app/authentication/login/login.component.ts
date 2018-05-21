import { Component, OnInit, OnDestroy } from '@angular/core';
import {HttpClient, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders} from '@angular/common/http';
import { FormGroup, FormControl, Validators,  } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { flyInOut } from '../../animations';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
  animations: [flyInOut]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  showSpinner = false;
  error = '';

  login$;

  constructor(
    private http: HttpClient,
    private _auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  ngOnDestroy() {
    // unsubscribe to prevent memory leaks
    if (this.login$ && this.login$ !== 'undefined') {
      this.login$.unsubscribe();
    }
  }

  createFormControls() {
    (this.email = new FormControl('', [
      Validators.required,
      Validators.pattern('[^ @]*@[^ *]*')
    ])),
      (this.password = new FormControl('', [
        Validators.required,
      ]));
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  loginUser() {
    // clear any existing data
     this._auth.logout();

    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      // set loading to true and then false if error
      this.showSpinner = true;
      this.login$ = this._auth.login(email, password).subscribe(() => {
        this.router.navigateByUrl('/');
      },
      err => {
        this.error = err.status === 401 ? 'Please check your email and password' : 'Error';
        this.showSpinner = false;
      });
    }

    this.loginForm.reset();
  }
}
