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

  requestedAny: boolean;
  upcomingAny: boolean;
  enrolledAny: boolean;

   constructor(private _tournament: TournamentService,
     private router: Router
  ) { }

  private join$: Subscription;
  private request$: Subscription;
  private enrolled$: Subscription;
  private unenrolled$: Subscription;


  ngOnInit() {
    this.getUserRequests();
    this.getEnrolledTourneys();
    this.getUnEnrolledTourneys(); 
  }

  ngOnDestroy() {
    if (this.join$ && this.join$ !== null) this.join$.unsubscribe();
    if (this.request$ && this.request$ !== null) this.request$.unsubscribe();
    if (this.enrolled$ && this.enrolled$ !== null) this.enrolled$.unsubscribe();
    if (this.unenrolled$ && this.unenrolled$ !== null) this.unenrolled$.unsubscribe();
  }

  //tournaments with active requests
  getUserRequests() {
    this.request$ = this._tournament.getUserRequests().subscribe(res => {
      this.requested = res["data"];
      console.log('Requested')

      console.log(this.requested)
      this.requestedAny = this.requested.length > 0;
    });
  }
  
  //tournaments that are not yet started but has no user request
  getUnEnrolledTourneys() {
    this.unenrolled$ = this._tournament.getUnEnrolledTournaments().subscribe(res => {
      this.upcoming = res["data"];
      //console.log(this.upcoming)
      this.upcomingAny = this.upcoming.length > 0;
    });
  }

  //enrolled tournaments
  getEnrolledTourneys() {
    this.enrolled$ = this._tournament.getEnrolledTournaments().subscribe(res => {
      this.enrolled = res["data"];
      console.log('Enrolled')
      console.log(this.enrolled)
      this.enrolledAny = this.enrolled.length > 0;
    });
  }

  join(id) {
    this.join$ = this._tournament.joinTournament(id).subscribe(res => {
      this.refreshLists();
    });
  }

  refreshLists() {
    this.getUserRequests();
    this.getEnrolledTourneys();
    this.getUnEnrolledTourneys();
  }

}
