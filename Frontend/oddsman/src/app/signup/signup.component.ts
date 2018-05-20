import { Component, OnInit } from '@angular/core';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {AbstractControl, FormControl, Validators, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { flyInOut } from "../animations";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
  animations: [flyInOut]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  passwords: FormGroup;
  email: FormControl;
  password: FormControl;
  confirm: FormControl; 
  name: FormControl;
  tag: FormControl;
  showSpinner: boolean = false;
  error = "";


  login$;
  signup$;

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
  //unsubscribe to prevent memory leaks
    if(this.login$ && this.login$ !== "undefined" && this.signup$ && this.signup$ !== "undefined") {
      this.login$.unsubscribe();
      this.signup$.unsubscribe();
    }
  }

  createFormControls() {
    this.email = new FormControl("", [
      Validators.required,
      Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
    ]),
      this.password = new FormControl("", [
        Validators.required,
        Validators.minLength(8) 
      ]),
      this.confirm = new FormControl("", [
         Validators.required,    
      ]),
      this.name = new FormControl("", [
        Validators.required,    
      ]),
      this.tag = new FormControl("", [
        Validators.required,    
      ])
  }

  createForm() {
    //creating the password group first so we can assign it to a variable
    //this makes validation expressions shorter
    this.passwords = new FormGroup({
      password: this.password,
      confirm: this.confirm
    }, this.areEqual)

    this.signupForm = new FormGroup({
      tag: this.tag,
      name: this.name,
      email: this.email,     
      passwords: this.passwords
    });    
  }

  //used to determine whether the passwords match
  private areEqual(c: AbstractControl): ValidationErrors | null {
    const keys: string[] = Object.keys(c.value);
    for (const i in keys) {
      if (i !== "0" && c.value[keys[+i - 1]] !== c.value[keys[i]]) {
        return { areEqual: true };
      }
    }
  }

  signupUser() {
    if (this.signupForm.valid) {
      const name = this.signupForm.value.name;
      const tag = this.signupForm.value.tag;
      const email = this.signupForm.value.email;
      const password = this.passwords.value.password;

      //set loading to true and then false if error
      this.showSpinner = true;
      this.signup$ = this._auth.signup(name, tag, email, password).subscribe(
        () => {
          //logging the user in after we signed him up
          this.login$ = this._auth.login(email, password).subscribe(() => {
            this.router.navigateByUrl('/');
          }),
            err => {
              this.error = "Error logging in";
              this.showSpinner = false;
            };
        },
        err => {
          if(err.status === 409) {
            //409 is sent if email or tag wasn't unique
            this.error = err.error.err;
          } else {
            this.error = "Server Error";
          }         
          this.showSpinner = false;
        }
      );
    }
  }
}
