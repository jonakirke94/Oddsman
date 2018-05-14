import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../../services/tournament.service';
import { DropdownModule } from 'primeng/dropdown';
import { OddsService } from '../../../services/odds.service';
import { SelectItem } from 'primeng/components/common/api';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-my-bets',
  templateUrl: './my-bets.component.html',
  styleUrls: ['./my-bets.component.sass']
})
export class MyBetsComponent implements OnInit {

  loading: boolean;

  tournaments: Tour[];

  selectedTour: Tour;

  bets: any[];

  tournaments$ : Subscription;
  bets$: Subscription;


  constructor(private _tour: TournamentService, private _odds: OddsService) { }

  ngOnInit() {
    this.populateDropdown();
  }

  ngOnDestroy() {
    if (this.tournaments$ && this.tournaments$ !== null) this.tournaments$.unsubscribe();
    if (this.bets$ && this.bets$ !== null) this.bets$.unsubscribe();
  }

  displayBets(tourId) {
    this.loading = true;
    this.bets$ = this._odds.getBets(tourId).subscribe(res => {
      this.bets = res
      this.loading = false;
      
    });
  }

  refresh() {
    const tourId = this.selectedTour.code;
    this.displayBets(tourId)
  }

  populateDropdown() {
    this.tournaments$ = this._tour.getEnlistedTournaments().subscribe(res => {
      const tourneys = res['data']['tournaments'];
      this.tournaments = tourneys.map(tour => {
        return {
          name: tour.Name,
          code: tour.Id
        }
      })
    })
  }

  calculateOddsTotal(week: string) {
    let total = 0;

    if(this.bets) {
        for(let bet of this.bets) {
            if(bet.week === week && bet.match.result) {
                if(bet.match.result.CorrectBet) {
                  total += bet.odds
                }
            }
        }
    }

    return total;
}
}


export interface Tour {
  name: string;
  code: string;
}