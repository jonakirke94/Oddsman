import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../../services/tournament.service';
import { DropdownModule } from 'primeng/dropdown';
import { OddsService } from '../../../services/odds.service';
import { SelectItem } from 'primeng/components/common/api';


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


  constructor(private _tour: TournamentService, private _odds: OddsService) { }

  ngOnInit() {
    this.populateDropdown();
  }

  displayBets(tourId) {
    this.loading = true;
    this._odds.getBets(tourId).subscribe(res => {
      this.bets = res
      this.loading = false;
      console.log(res)
    });
  }

  refresh() {
    const tourId = this.selectedTour.code;
    this.displayBets(tourId)
  }

  populateDropdown() {
    this._tour.getEnlistedTournaments().subscribe(res => {
      const tourneys = res['data']['tournaments'];
      this.tournaments = tourneys.map(tour => {
        return {
          name: tour.Name,
          code: tour.Id
        }
      })
    })
  }
}


export interface Tour {
  name: string;
  code: string;
}