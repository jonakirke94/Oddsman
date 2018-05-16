import { Component, OnInit } from '@angular/core';
import { MatchService, Match } from '../../../services/match.service';

@Component({
  selector: 'app-edit-match',
  templateUrl: './edit-match.component.html',
  styleUrls: ['./edit-match.component.sass']
})
export class EditMatchComponent implements OnInit {

  matches: Match[];

  displayDialog: boolean;

  match: Match = {};

    selectedMatch: Match;

    newMatch: boolean;



    cols: any[];


  constructor(private _match : MatchService) { }

  ngOnInit() {
    this.loadMatches();

    this.cols = [
      { field: 'Id', header: 'Id' },
      { field: 'MatchName', header: 'Kamp' },
    ];
  }

  ngOnDestroy() {

  }

  loadMatches() {
    this._match.getMissingMatches().subscribe(res => {
      this.matches = res;
      console.log(this.matches)
    })
  }

  showDialogToAdd() {
    this.newMatch = true;
    this.match = {};
    this.displayDialog = true;
}

save() {
/*     let cars = [...this.cars];
    if (this.newCar)
        cars.push(this.car);
    else
        cars[this.cars.indexOf(this.selectedCar)] = this.car;

    this.cars = cars;
    this.car = null; */
    this.displayDialog = false;
}

/* delete() {
    let index = this.cars.indexOf(this.selectedCar);
    this.cars = this.cars.filter((val, i) => i != index);
    this.car = null;
    this.displayDialog = false;
} */

onRowSelect(event) {
    this.newMatch = false;
    this.match = this.cloneMatch(event.data);
    this.displayDialog = true;
}

cloneMatch(m: Match): Match {
    let match = {};
    for (let prop in m) {
        match[prop] = m[prop];
    }
    return match;
}

}


