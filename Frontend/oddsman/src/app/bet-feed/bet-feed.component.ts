import { Component, OnInit } from '@angular/core';
import { SocketService, Event, Action } from '../services/socket.service';
import { trigger,style,transition,animate,keyframes,query,stagger} from '@angular/animations'; 
import { OddsService } from '../services/odds.service';
import { feedAnimation } from "../animations";
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'bet-feed',
  templateUrl: './bet-feed.component.html',
  styleUrls: ['./bet-feed.component.sass'],
  animations: [feedAnimation]
})
export class BetFeedComponent implements OnInit {

  bets = []
  ioConnection: any;
  tempBet;

  bets$: Subscription
  newBets$: Subscription
  socketMsg$: Subscription

  constructor(private _socket : SocketService, private _odds : OddsService) {
  }

  ngOnInit() {
    this.loadBetFeed();
    this.bets$ = this._odds.bet.subscribe(res => this.bets = res);
    this._odds.changeBet(this.bets);
    this.initIoConnection();
  }

  ngOnDestroy() {
    this.bets$.unsubscribe();
    this.newBets$.unsubscribe();
    this.socketMsg$.unsubscribe();
    this._socket.disconnectSocket();
  }

  private loadBetFeed() :void {
    this.newBets$ = this._odds.getNewestBets().subscribe(res => {
      console.log(res)
    })
    this.seedFakeBets();
  }

  private addBet(bet) :void {
    if(!bet) {
      bet = this.tempBet;
    }

    this.bets.push(bet)
 
      this._odds.changeBet(this.bets);
  }

  private removeBet() :void {
    this.tempBet = this.bets.shift();
    this._odds.changeBet(this.bets);
  }

  private pushBet(bet) {  
    this.removeBet(); 
    setTimeout(() => {
      this.addBet(bet);
    }, 500);

  }
 
  private initIoConnection(): void {
    this._socket.initSocket();

    this.socketMsg$ = this._socket.onOddsMessage()
      .subscribe((bet) => {
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
