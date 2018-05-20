import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as moment from 'moment';
import { feedAnimation } from '../../animations';
import { MatchService } from '../../services/match.service';


@Component({
  selector: 'result-feed',
  templateUrl: './result-feed.component.html',
  styleUrls: ['./result-feed.component.sass'],
  animations: [feedAnimation]
})
export class ResultFeedComponent implements OnInit, OnDestroy {

  results = [];

  results$: Subscription;
  polling$: Subscription;


  constructor(private _match: MatchService) {
  }

  ngOnInit() {
    if (this.isWithinMatchDays()) {
      this.resultPolling();
    }
  }

  ngOnDestroy() {
    if (this.results$) { this.results$.unsubscribe(); }
    if (this.polling$) { this.polling$.unsubscribe(); }
  }

  private resultPolling() {
    //300000 = 5m

    this.polling$ = Observable.interval(300000).startWith(0).subscribe(res => this.getRecentResults());
  }

  private getRecentResults() {
    this.results$ = this._match.getRecentResults().subscribe(res => {
    this.results = res;
      this._match.changeRes(this.results);
    }
    );
  }

  isWithinMatchDays() {
    const weekday = moment().isoWeekday();
    //sunday == 0
    return weekday == 6 || weekday == 0 || weekday == 1 //sat/sun/mon
  }
}
