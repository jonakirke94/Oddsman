import { Component, OnInit, OnDestroy } from '@angular/core';
import { feedAnimation } from '../animations';
import { SocketService } from '../services/socket.service';
import { MatchService } from '../services/match.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'result-feed',
  templateUrl: './result-feed.component.html',
  styleUrls: ['./result-feed.component.sass'],
  animations: [feedAnimation]
})
export class ResultFeedComponent implements OnInit, OnDestroy {

  results = [];

  results$: Subscription;

  constructor(private _match: MatchService) {
  }

  ngOnInit() {
    this.loadBetFeed();
  }

  ngOnDestroy() {
    if (this.results$) { this.results$.unsubscribe(); }
  }

  private loadBetFeed() {
    /* this.seedFakeBets(); */
    this.results$ = this._match.getRecentResults().subscribe(res => {
      this.results = res;
      console.log(res);
      this._match.changeRes(this.results);
    });
  }

  /* seedFakeBets(): void {
    this.results.push({
      time: '18:17', tag: 'AA',
      matches: [
        { id: '5', match: 'Manchester United - Manchester City', bet: '1', odds: '2.55' },
        { id: '12', match: 'XXX-YYY', bet: 'X', odds: '5.55' },
        { id: '64', match: 'ZZZ-VVVV', bet: '2', odds: '3.11' }
      ]
    });

    this.results.push({
      time: '18:17', tag: 'BB',
      matches: [
        { id: '5', match: 'Aab-FCK', bet: '1', odds: '2.55' },
        { id: '12', match: 'XXX-YYY', bet: 'X', odds: '5.55' },
        { id: '64', match: 'ZZZ-VVVV', bet: '2', odds: '3.11' }
      ]
    });

    this.results.push({
      time: '18:17', tag: 'CC',
      matches: [
        { id: '5', match: 'Aab-FCK', bet: '1', odds: '2.55' },
        { id: '12', match: 'XXX-YYY', bet: 'X', odds: '5.55' },
        { id: '64', match: 'ZZZ-VVVV', bet: '2', odds: '3.11' }
      ]
    });
}*/
}
