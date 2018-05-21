import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TournamentService } from '../../services/tournament.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'standing',
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.sass']
})
export class StandingComponent implements OnInit, OnChanges {

  @Input() tournamentId: string;

  standings: any[];
  tournament$: Subscription;

  private tournament;

  constructor(private _tour: TournamentService) { }

  ngOnInit() {
    this.getActiveTournament();
  }

  // whenever input changes update standing to new tournament
  ngOnChanges(change: SimpleChanges) {
    const newTourId = change['tournamentId'].currentValue;
    if (newTourId) {
      this.loadData(newTourId);
    }
  }

  loadData(id) {
    this._tour.getStanding(id).subscribe(res => {
      this.standings = res['data']['standings'];
      this.tournament = {};
      this.tournament.id =  res['data']['id'];
      this.tournament.name = res['data']['name'];
      this.tournament.ongoing = res['data']['ongoing'];
      this.tournament.week = res['data']['week'];
    });
  }

  getActiveTournament() {
    if (!this.tournamentId) {
      this.tournament$ = this._tour.getCurrentTournament().subscribe(res => {
        this.tournament = res['data'];

        if (this.tournament) {
          this.loadData(this.tournament.id);
        }
      });
    }
  }



}
