import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../../services/tournament.service';
import {DropdownModule} from 'primeng/dropdown';
import { OddsService } from '../../../services/odds.service';
import { SelectItem } from 'primeng/components/common/api';


@Component({
  selector: 'app-my-bets',
  templateUrl: './my-bets.component.html',
  styleUrls: ['./my-bets.component.sass']
})
export class MyBetsComponent implements OnInit {

  cities: City[];

  selectedCity: City;

  

  constructor(private _tour: TournamentService, private _odds: OddsService) {
    this.cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
  ];
   }

  ngOnInit() {
    //this._tour.getEnlistedTournaments().subscribe(tourneys => tourneys['data'] = this.tours);
    this._odds.getBets(4).subscribe(res => console.log(res));
    
    
}


}

export class Tour {
    Id;
    Name;
    Start;
    End;
}

export interface City {
  name: string;
  code: string;
}