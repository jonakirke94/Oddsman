import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { TournamentService } from '../services/tournament.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'standing',
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.sass']
})
export class StandingComponent implements OnInit {

  @Input() tournamentId

  standings: any[];
  tournament$ : Subscription

  private tournament;
  private currentWeek;

  constructor(private _tour: TournamentService) { }

  ngOnInit() {
    this.getWeek();
    this.loadStanding();
  }


  getWeek() {
    this.currentWeek = moment().isoWeek();
  }

  loadStanding() {
    if(this.tournamentId) {
      console.log('Id was passed')
      this.loadData(this.tournamentId);
    } else {
      console.log('Id was not passed')

      this.getActiveTournament()
    }
  }

  loadData(id) {
    console.log('Id: ' + id)
    this._tour.getStanding(id).subscribe(res => {
      console.log(res);
      this.standings = res['data']['standings'] 
    })
  }

  getActiveTournament() {
    this.tournament$ = this._tour.getCurrentTournament().subscribe(res => {
      this.tournament = res['data'];

      if(this.tournament) {
        this.loadData(this.tournament.id);
      }
    });
  }

  

}
