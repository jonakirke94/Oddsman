import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,  } from "@angular/forms";
import { flyInOut } from '../../../animations';
import { OddsService } from '../../../services/odds.service';
import { TournamentService } from '../../../services/tournament.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { SocketService, Action } from '../../../services/socket.service';

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

  error: string;
  showMessage: boolean;
  showSpinner: boolean;

  private tournament;
  private currentWeek;

  tournament$ : Subscription

  constructor(private _odds: OddsService, private _tour: TournamentService, private _socket: SocketService) { }

  ngOnInit() {
    this.currentWeek = moment().isoWeek();
    this.getCurrentTournament();
    this.createFormControls();
    this.createForm();

    setTimeout(() => {
      this._socket.initSocket();
    }, 0);
  }

  ngOnDestroy() {
    if (this.tournament$ && this.tournament$ !== null) this.tournament$.unsubscribe();
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
      oddsNo2: this.oddsNo2,
      oddsNo3: this.oddsNo3,
      oddsOption1: this.oddsOption1,
      oddsOption2: this.oddsOption2,
      oddsOption3: this.oddsOption3,
    });

    this.sendbetsForm.controls['oddsOption1'].setValue('1');
    this.sendbetsForm.controls['oddsOption2'].setValue('X');
    this.sendbetsForm.controls['oddsOption3'].setValue('2');
  }

  getCurrentTournament() {
    this.showSpinner = true;

    this.tournament$ = this._tour.getCurrentUserTournament().subscribe(res => {
        this.tournament = res['data'];
        this.showSpinner = false;
    }, err => {
        this.showMessage = true;
        if(err.status === 404) {     
          this.error = 'Det ser ikke ud til du har nogle aktive turneringer. Hvis du mener det er en fejl, kontakt webmaster'
        } else {
          this.error = 'Noget gik galt - Prøv igen senere eller kontakt webmaster'
        }

        this.showSpinner = false;

    })
  }

  sendBets() {
    this.showSpinner = true;

    const odds = [
    {
      matchId: this.sendbetsForm.value.oddsNo1,
      option: this.sendbetsForm.value.oddsOption1
    },
    {
      matchId: this.sendbetsForm.value.oddsNo2,
      option: this.sendbetsForm.value.oddsOption2
    },
    {
      matchId: this.sendbetsForm.value.oddsNo3,
      option: this.sendbetsForm.value.oddsOption3
    },
  ]

    this._odds.sendOdds(this.tournament.id, odds).subscribe(res => {
      //INIT SOCKET AND EMIT ACTION SO SERVER CAN TELL CLIENTS SHOULD REFRESH FEED
      this._socket.initSocket(); 
      this._socket.send(Action.ODDS);

      this.showMessage = true;
      this.showSpinner = false;
    },
    err => {
      this.showMessage = true;

      if(err.status === 409) {
        this.error = err.error.msg
      } else {
      this.error = 'Dine odds kunne ikke afsendes - Prøv igen senere eller send dine tegn til webmaster + 2 andre deltager pr mail.'     
      }
      this.showSpinner = false;
    })
  }

  



}


