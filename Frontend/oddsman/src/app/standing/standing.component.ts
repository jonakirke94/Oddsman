import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../services/tournament.service';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';


@Component({
  selector: 'app-standing',
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.sass']
})
export class StandingComponent implements OnInit {

  standings: any[];

  private tournament;
  private currentWeek;
  private threeWeekStart;

  tournament$ : Subscription


  constructor(private _tour: TournamentService) { }

  ngOnInit() {

    this.getActiveTournament();
    this.getWeeks();

    /* this.standings = [
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
  ]; */
  }

  getActiveTournament() {
    this.tournament$ = this._tour.getCurrentTournament().subscribe(res => {
      this.tournament = res['data'];

      if(this.tournament) {
        this.loadStanding(this.tournament.id);
      }
    });
  }

  getWeeks() {
    this.currentWeek = moment().isoWeek();
    this.threeWeekStart = moment().add(-14, 'd').isoWeek();
  }

  loadStanding(id) {
    console.log('Id: ' + id)
    this._tour.getStanding(id).subscribe(res => {
      console.log(res);
      this.standings = res['data']['standings'] 
    })
  }

}
