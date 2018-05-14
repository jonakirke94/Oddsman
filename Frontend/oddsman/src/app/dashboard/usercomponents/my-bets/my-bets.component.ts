import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../../services/tournament.service';
import { SelectItem } from 'primeng/components/common/api';
import { OddsService } from '../../../services/odds.service';

@Component({
  selector: 'app-my-bets',
  templateUrl: './my-bets.component.html',
  styleUrls: ['./my-bets.component.sass']
})
export class MyBetsComponent implements OnInit {

  tours: Tour[];

  brands: SelectItem[];
    
  colors: SelectItem[];
    
  yearFilter: number;
    
  yearTimeout: any;

  constructor(private _tour: TournamentService, private _odds: OddsService) { }

  ngOnInit() {
    //this._tour.getEnlistedTournaments().subscribe(tourneys => tourneys['data'] = this.tours);
    this._odds.getBets(4).subscribe(res => console.log(res));
    
    this.brands = [];
    this.brands.push({label: 'All Brands', value: null});
    this.brands.push({label: 'Audi', value: 'Audi'});
    this.brands.push({label: 'BMW', value: 'BMW'});
    this.brands.push({label: 'Fiat', value: 'Fiat'});
    this.brands.push({label: 'Honda', value: 'Honda'});
    this.brands.push({label: 'Jaguar', value: 'Jaguar'});
    this.brands.push({label: 'Mercedes', value: 'Mercedes'});
    this.brands.push({label: 'Renault', value: 'Renault'});
    this.brands.push({label: 'VW', value: 'VW'});
    this.brands.push({label: 'Volvo', value: 'Volvo'});
    
    this.colors = [];
    this.colors.push({label: 'White', value: 'White'});
    this.colors.push({label: 'Green', value: 'Green'});
    this.colors.push({label: 'Silver', value: 'Silver'});
    this.colors.push({label: 'Black', value: 'Black'});
    this.colors.push({label: 'Red', value: 'Red'});
    this.colors.push({label: 'Maroon', value: 'Maroon'});
    this.colors.push({label: 'Brown', value: 'Brown'});
    this.colors.push({label: 'Orange', value: 'Orange'});
    this.colors.push({label: 'Blue', value: 'Blue'});
}

onYearChange(event, dt, col) {
    if(this.yearTimeout) {
        clearTimeout(this.yearTimeout);
    }
    
    this.yearTimeout = setTimeout(() => {
        dt.filter(event.value, col.field, col.filterMatchMode);
    }, 250);
}
}

export class Tour {
    Id;
    Name;
    Start;
    End;
}
