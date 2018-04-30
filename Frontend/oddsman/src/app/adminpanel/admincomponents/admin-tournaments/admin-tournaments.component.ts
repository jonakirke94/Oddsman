import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TournamentService } from '../../../services/tournament.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-admin-tournaments',
  templateUrl: './admin-tournaments.component.html',
  styleUrls: ['./admin-tournaments.component.sass']
})
export class AdminTournamentsComponent implements OnInit {

  tournaments = [];
  rangeDates: Date[];
  name: string

  constructor(private _tournament: TournamentService) { }

  ngOnInit() {
    this.getTournaments();
  }

  openModal() {
    document.querySelector('#modal').classList.add("is-active");
  }

  closeModal() {
    document.querySelector('#modal').classList.remove("is-active");
  }

  createTournament() {
    const name = this.name;
    const start = this.rangeDates[0];
    const end = this.rangeDates[1];
    this._tournament.createTournament(name, start, end).subscribe(res => {
         document.querySelector('#modal').classList.remove("is-active");
    });
  }

  getTournaments() {
    this._tournament.getAll()
    .subscribe(res => {
      this.tournaments = res["data"];
     });
}

}
