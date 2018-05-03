import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-usersettings',
  templateUrl: './usersettings.component.html',
  styleUrls: ['./usersettings.component.sass']
})
export class UsersettingsComponent implements OnInit {

  settingsForm: FormGroup;
  email: FormControl;
  name: FormControl;
  tag: FormControl;

  update$: Subscription;

  error: string;
  msg: string;


  constructor(private _user: UserService) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  ngOnDestroy() {
    if (this.update$ && this.update$ !== null) this.update$.unsubscribe();
  }

  createForm() {
    this.settingsForm = new FormGroup({
      email: this.email,
      name: this.name,
      tag: this.tag
    });
  }

  createFormControls() {
    (this.email = new FormControl("", [
      Validators.pattern("[^ @]*@[^ *]*")
    ])),
    this.name = new FormControl("")
    this.tag = new FormControl("");
  }

  updateUser() {
    const name = this.settingsForm.value.name;
    const tag = this.settingsForm.value.tag;
    const email = this.settingsForm.value.email;

    if(!name && !tag && !email) {
      this.error = 'Ingen værdier indtastet';
      return;
    }

    if(this.settingsForm.valid) {
      const button = document.getElementById('submit');
      button.classList.add('is-loading');

  

      this.update$ = this._user.updateUser(name, tag, email).subscribe(() =>  {
        this.error = '';
        this.msg = "Dine indstillinger blev opdateret!";
        button.classList.remove('is-loading')
      }, 
      err => {
        if(err.status === 409) {
          this.error = err.error.err;
        } else {
          this.error = "Server Error";
        }         
        this.msg = '';
        button.classList.remove('is-loading')    
      });

    } 

  }

}
