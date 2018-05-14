import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../../services/tournament.service';
import {DropdownModule} from 'primeng/dropdown';
import { OddsService, Bet } from '../../../services/odds.service';
import { SelectItem } from 'primeng/components/common/api';


@Component({
  selector: 'app-my-bets',
  templateUrl: './my-bets.component.html',
  styleUrls: ['./my-bets.component.sass']
})
export class MyBetsComponent implements OnInit {

  cities: City[];

  selectedCity: City;

  bets: Bet[] ;

  

  constructor(private _tour: TournamentService, private _odds: OddsService) {
   
    
   }

  ngOnInit() {
    //this._tour.getEnlistedTournaments().subscribe(tourneys => tourneys['data'] = this.tours);
    this._odds.getBets(1).subscribe(res => {
      res
    });
      

    
      


    console.log(this.bets)

   
    
    this.cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
  ];
   
}

refresh() {
  console.log('Refreshed!')
}


}



export interface City {
  name: string;
  code: string;
}