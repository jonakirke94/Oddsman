import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../services/tournament.service';
import { Subscription } from 'rxjs/Subscription';
import { StandingComponent} from "../standing/standing.component";


@Component({
  selector: 'app-standing',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {




  constructor(private _tour: TournamentService) { }

  ngOnInit() {

/*     this.getActiveTournament();
    this.getWeeks();
 */
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

  



}
