import { Component, OnInit } from '@angular/core';
import { StandingComponent } from '../../shared/standing/standing.component';
import { BetFeedComponent} from '../../shared/bet-feed/bet-feed.component';
import { ResultFeedComponent} from '../../shared/result-feed/result-feed.component';

@Component({
  selector: 'app-standing',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})

export class HomeComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
