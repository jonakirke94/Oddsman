import { Component, OnInit } from '@angular/core';
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
export class UserTournamentsComponent implements OnInit {

  requested = [];
  upcoming = [];
  enrolled = [];

  //showUpcoming = this.upcoming.length > 0;

   constructor(private _tournament: TournamentService,
     private router: Router
  ) { }

  private tourneysub$: Subscription;
  private createsub$: Subscription;

  ngOnInit() {
    this.getUserRequests();
    this.getEnrolledTourneys();
    this.getUnEnrolledTourneys(); 
  }

  //tournaments with active requests
  getUserRequests() {
    this.createsub$ = this._tournament.getUserRequests().subscribe(res => {
      this.requested = res["data"];
    });
  }
  
  //tournaments that are not yet started but has no user request
  getUnEnrolledTourneys() {
    this.createsub$ = this._tournament.getUnEnrolledTournaments().subscribe(res => {
      this.upcoming = res["data"];
    });
  }

  //enrolled tournaments
  getEnrolledTourneys() {
    this.createsub$ = this._tournament.getEnrolledTournaments().subscribe(res => {
      this.enrolled = res["data"];
    });
  }

  join(id) {
    this.createsub$ = this._tournament.joinTournament(id).subscribe(res => {
      this.refreshLists();
    });
  }

  refreshLists() {
    this.getUserRequests();
    this.getEnrolledTourneys();
    this.getUnEnrolledTourneys();
  }

}
