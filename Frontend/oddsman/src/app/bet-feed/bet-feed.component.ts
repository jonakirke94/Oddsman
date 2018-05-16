import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bet-feed',
  templateUrl: './bet-feed.component.html',
  styleUrls: ['./bet-feed.component.sass']
})
export class BetFeedComponent implements OnInit {

  bets = []

  constructor() { }

  ngOnInit() {
    this.bets.push({
      time: '18:17', tag: 'AA',  id: '5',
       matches: [
         {match: 'Aab-FCK', bet: '1', odds: '2.55'},
         {match: 'XXX-YYY', bet: 'X', odds: '5.55'},
         {match: 'ZZZ-VVVV', bet: '2', odds: '3.11'}
        ]
    })




/*     this.bets.push({time: '15:17',tag: 'BB', id: '6', match: 'Fcm-Ach', bet: '2', odds: '3.55'})
    this.bets.push({time: '13:25',tag: 'CC', id: '53', match: 'AGF-OB', bet: '1', odds: '2.00'}) */
  }

}
