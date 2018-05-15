import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-standing',
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.sass']
})
export class StandingComponent implements OnInit {

  users: any[];


  constructor() { }

  ngOnInit() {

    this.users = [
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
      { position: '1', tag: 'CC', name: 'Carter', correctBets: 11, totalBets: 33, points: 22.93, distanceToOne: 5.94, pointsLastWeek: 10.0, pointsLastThreeWeeks: 14},
  ];
  }

}
