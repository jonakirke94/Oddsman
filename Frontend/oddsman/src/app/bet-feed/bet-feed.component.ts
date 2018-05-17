import { Component, OnInit } from '@angular/core';
import { SocketService, Event, Action } from '../services/socket.service';
import { trigger,style,transition,animate,keyframes,query,stagger} from '@angular/animations'; 
import { OddsService } from '../services/odds.service';
import { feedAnimation } from "../animations";


@Component({
  selector: 'bet-feed',
  templateUrl: './bet-feed.component.html',
  styleUrls: ['./bet-feed.component.sass'],
  animations: [feedAnimation]
})
export class BetFeedComponent implements OnInit {

  bets = []
  ioConnection: any;


  constructor(private _socket : SocketService, private _odds : OddsService) {
  }

  ngOnInit() {
    this.loadBetFeed();
    this._odds.bet.subscribe(res => this.bets = res);
    this._odds.changeBet(this.bets);


  this.initIoConnection();
  }

  ngOnDestroy() {
    this._socket.disconnectSocket();
  }

  private loadBetFeed() : void {
    this.seedFakeBets();
  }

  addBet() {
    this.bets.push({
      time: '18:17', tag: 'NN',
       matches: [
         { id: '999', match: 'XXX - XXX', bet: '1', odds: '2.55'},
         { id: '999', match: 'XXX-YYY', bet: 'X', odds: '5.55'},
         { id: '888', match: 'ZZZ-VVVV', bet: '2', odds: '3.11'}
        ]
    })
 
      this._odds.changeBet(this.bets);
  }

  removeBet() {
    this.bets.shift();
    this._odds.changeBet(this.bets);
  }

  pushBet(bet) {
    
      this.removeBet(); 


    setTimeout(() => {
      this.addBet();
    }, 500);

  }
 
  private initIoConnection(): void {
    this._socket.initSocket();


    this.ioConnection = this._socket.onOddsMessage()
      .subscribe((bet) => {
        console.log(bet)
        this.pushBet(bet)
      });

  }

  seedFakeBets() : void {
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

    this._odds.changeBet(this.bets);

  }

}
