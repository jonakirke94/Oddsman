import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { TournamentService, Tour } from '../../../services/tournament.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.sass']
})
export class HistoryComponent implements OnInit {

  tournaments: Tour[];
  selectedTour: Tour;
  private tourId;

  params$ : Subscription
  tournaments$: Subscription


  constructor(private route: ActivatedRoute, private _tour: TournamentService) { }

  ngOnInit() {

    this.params$ = this.route.params.subscribe(params => {
      this.tourId = params["id"];
      
      if(this.tourId && this.tourId !== 'undefined') {
        this.loadStanding(this.tourId);      }
    })

    this.popoulateDropdown();
  }

  ngOnDestroy() {
    this.params$.unsubscribe();
    if (this.tournaments$ && this.tournaments$ !== null) this.tournaments$.unsubscribe();

  }

  loadStanding(tourId) {
    console.log('Loaded tournament for' + tourId)
  }

  refreshStanding() {
    const tourId = this.selectedTour.code;
    this.loadStanding(tourId);
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
