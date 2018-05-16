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
      time: '18:17', tag: 'AA',
       matches: [
         { id: '5', match: 'Manchester United - Manchester City', bet: '1', odds: '2.55'},
         { id: '12', match: 'XXX-YYY', bet: 'X', odds: '5.55'},
         { id: '64', match: 'ZZZ-VVVV', bet: '2', odds: '3.11'}
        ]
    })

    this.bets.push({
      time: '18:17', tag: 'BB',
       matches: [
         { id: '5', match: 'Aab-FCK', bet: '1', odds: '2.55'},
         { id: '12', match: 'XXX-YYY', bet: 'X', odds: '5.55'},
         { id: '64', match: 'ZZZ-VVVV', bet: '2', odds: '3.11'}
        ]
    })

    this.bets.push({
      time: '18:17', tag: 'CC',
       matches: [
         { id: '5', match: 'Aab-FCK', bet: '1', odds: '2.55'},
         { id: '12', match: 'XXX-YYY', bet: 'X', odds: '5.55'},
         { id: '64', match: 'ZZZ-VVVV', bet: '2', odds: '3.11'}
        ]
    })
  }

}
