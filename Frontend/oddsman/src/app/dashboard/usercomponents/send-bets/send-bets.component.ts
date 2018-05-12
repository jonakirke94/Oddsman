import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,  } from "@angular/forms";
import { flyInOut } from '../../../animations';
import { OddsService } from '../../../services/odds.service';



@Component({
  selector: 'app-send-bets',
  templateUrl: './send-bets.component.html',
  styleUrls: ['./send-bets.component.sass'],
  animations: [flyInOut]
})
export class SendBetsComponent implements OnInit {

  sendbetsForm : FormGroup
  oddsNo1 : FormControl
  oddsNo2 : FormControl
  oddsNo3 : FormControl
  oddsOption1 : FormControl
  oddsOption2 : FormControl
  oddsOption3 : FormControl
  options = ['1', 'X', '2']

  private tourInfo;

  constructor(private _odds: OddsService,) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {
    this.oddsNo1 = new FormControl("", [
      Validators.required,
    ]),
    this.oddsNo2 = new FormControl("", [
      Validators.required,
    ]),
    this.oddsNo3 = new FormControl("", [
      Validators.required,
    ]),
    this.oddsOption1 = new FormControl("", [
      Validators.required,
    ]),
    this.oddsOption2 = new FormControl("", [
      Validators.required,
    ]),
    this.oddsOption3 = new FormControl("", [
      Validators.required,
    ])
  }

  createForm() {
    this.sendbetsForm = new FormGroup({
      oddsNo1: this.oddsNo1,
      oddsNo2: this.oddsNo3,
      oddsNo3: this.oddsNo3,
      oddsOption1: this.oddsOption1,
      oddsOption2: this.oddsOption2,
      oddsOption3: this.oddsOption3,
    });

    this.sendbetsForm.controls['oddsOption1'].setValue('1');
    this.sendbetsForm.controls['oddsOption2'].setValue('X');
    this.sendbetsForm.controls['oddsOption3'].setValue('2');


    
  }

  sendBets() {
    const odds = [
    {
      matchId: this.sendbetsForm.value.oddsNo1,
      option: this.sendbetsForm.value.oddsOption1
    },
    {
      matchId: this.sendbetsForm.value.oddsNo1,
      option: this.sendbetsForm.value.oddsOption1
    },
    {
      matchId: this.sendbetsForm.value.oddsNo1,
      option: this.sendbetsForm.value.oddsOption1
    },
  ]

    console.log(odds);

  /*   this._odds.sendOdds(this.tourInfo.tourId, odds).subscribe(res => {
      res
    }) */

    

  }

}
