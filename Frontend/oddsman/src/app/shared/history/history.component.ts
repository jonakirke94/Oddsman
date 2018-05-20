import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { StandingComponent} from '../standing/standing.component';
import { TournamentService} from '../../services/tournament.service';
import { Tour } from '../../models/tour';

@Component({
  selector: 'history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.sass']
})
export class HistoryComponent implements OnInit {

  tournaments: Tour[];
  selectedTour: Tour;
  tournamentId: string;

  params$ : Subscription
  tournaments$: Subscription


  constructor(private route: ActivatedRoute, private _tour: TournamentService) { }

  ngOnInit() {

    this.params$ = this.route.params.subscribe(params => {
      this.tournamentId = params["id"];
    })

    this.popoulateDropdown();
  }

  ngOnDestroy() {
    this.params$.unsubscribe();
    
    if (this.tournaments$ && this.tournaments$ !== null) this.tournaments$.unsubscribe();

  }

  refreshStanding(id) {
    this.tournamentId = this.selectedTour.code;
  }

  popoulateDropdown() {
      this.tournaments$ = this._tour.getAll().subscribe(res => {
        const tourneys = res['data'];
        this.tournaments = tourneys.map(tour => {
          return {
            name: tour.Name,
            code: tour.Id
          }
        })
      })
  }



}
