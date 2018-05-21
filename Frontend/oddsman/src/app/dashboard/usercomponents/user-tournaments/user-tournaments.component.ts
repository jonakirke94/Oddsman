import { Component, OnInit, OnDestroy } from '@angular/core';
import { TournamentService } from '../../../services/tournament.service';
import { Router } from '@angular/router';
import { listAnimations} from '../../../animations';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-tournaments',
  templateUrl: './user-tournaments.component.html',
  styleUrls: ['./user-tournaments.component.sass'],
  animations: [listAnimations]

})
export class UserTournamentsComponent implements OnInit, OnDestroy {

  requested = [];
  delisted = []; // upcoming tournaments
  enlisted = []; // participating in these

  requestedAny: boolean;
  delistedAny: boolean;
  enlistedAny: boolean;

   constructor(private _tournament: TournamentService,
     private router: Router
  ) { }

  private join$: Subscription;
  private request$: Subscription;
  private enlisted$: Subscription;
  private delisted$: Subscription;


  ngOnInit() {
    this.getRequestedTournaments();
    this.getEnlistedTournaments();
    this.getDelistedTournaments();
  }

  ngOnDestroy() {
    if (this.join$ && this.join$ !== null) { this.join$.unsubscribe(); }
    if (this.request$ && this.request$ !== null) { this.request$.unsubscribe(); }
    if (this.enlisted$ && this.enlisted$ !== null) { this.enlisted$.unsubscribe(); }
    if (this.delisted$ && this.delisted$ !== null) { this.delisted$.unsubscribe(); }
  }

  // tournaments with active requests
  getRequestedTournaments() {
    this.request$ = this._tournament.getUserRequests().subscribe(res => {
      this.requested = res['data']['tournaments'];
      this.requestedAny = this.requested.length > 0;
    });
  }

  // tournaments that are not yet started but has no user request
  getDelistedTournaments() {
    this.delisted$ = this._tournament.getDelistedTournaments().subscribe(res => {
      this.delisted = res['data'];
      this.delistedAny = this.delisted.length > 0;
    });
  }

  // tournaments user is participating in
  getEnlistedTournaments() {
    this.enlisted$ = this._tournament.getEnlistedTournaments().subscribe(res => {
      this.enlisted = res['data']['tournaments'];
      this.enlistedAny = this.enlisted.length > 0;
    });
  }

  join(id) {
    this.join$ = this._tournament.joinTournament(id).subscribe(res => {
      this.refreshLists();
    });
  }

  details(id) {
    this.router.navigateByUrl(`/dashboard/historik/${id}`);
  }

  refreshLists() {
    this.getRequestedTournaments();
    this.getEnlistedTournaments();
    this.getDelistedTournaments();
  }

}
