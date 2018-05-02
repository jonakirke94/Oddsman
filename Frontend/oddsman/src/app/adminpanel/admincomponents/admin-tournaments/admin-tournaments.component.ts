import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { TournamentService } from '../../../services/tournament.service';
import { listAnimations} from '../../../animations';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-admin-tournaments',
  templateUrl: './admin-tournaments.component.html',
  styleUrls: ['./admin-tournaments.component.sass'],
  animations: [listAnimations]
    
})
export class AdminTournamentsComponent implements OnInit {

  tournaments = [];
  rangeDates: Date[];
  name: string
  error = '';

  private tourneysub$: any;
  private createsub$: any;


  constructor(private _tournament: TournamentService,
     private router: Router
  ) { }

  ngOnInit() {
    this.getTournaments();
  }

  ngOnDestroy() {
    if (this.tourneysub$ && this.tourneysub$ !== "undefined") this.tourneysub$.unsubscribe();
    if (this.createsub$ && this.createsub$ !== "undefined") this.createsub$.unsubscribe();
  }

  openModal() {
    document.querySelector('#modal').classList.add("is-active");
  }

  closeModal() {
    document.querySelector('#modal').classList.remove("is-active");
  }

  createTournament() {
    const button = document.querySelector('#modal-submit');
    button.classList.add("is-loading");


    if(this.name === 'undefined' || typeof this.rangeDates === 'undefined') {
        this.error = 'Udfyld venligst alle felter';
        button.classList.remove("is-loading");
        return;
    }

    const name = this.name;
    const start = this.rangeDates[0];
    const end = this.rangeDates[1];

    this.tourneysub$ = this._tournament.createTournament(name, start, end).subscribe(() => {
        this.getTournaments();
        button.classList.remove("is-loading");
        this.closeModal();
    },
    err => {
      this.error = err.status === 409 ? "Turneringsnavn skal være unikt" : "Har du sat 2 datoer?";
      button.classList.remove("is-loading");
    });
  }

  getTournaments() {
    this.createsub$ = this._tournament.getAll().subscribe(res => {
      this.tournaments = res["data"];
     });
}

goToRequests(id) {
  this.router.navigateByUrl(`/admin/requests/${id}`);
}


}