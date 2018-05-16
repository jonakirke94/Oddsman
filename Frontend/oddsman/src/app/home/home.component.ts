import { Component, OnInit } from '@angular/core';
import { StandingComponent } from "../standing/standing.component";
import { BetFeedComponent} from '../bet-feed/bet-feed.component';
import { SocketService, Action } from '../services/socket.service';

@Component({
  selector: 'app-standing',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})



export class HomeComponent implements OnInit {




  constructor(private _socket: SocketService) {
  }

  ngOnInit() {

  }



  testSocket() {
    console.log('Test Socket Clicked')


 /*    this._socket.initSocket(); */
    this._socket.send(Action.ODDS);



  
      this._socket.onOddsMessage()
        .subscribe((data: string) => {
         
          //this.loadBetFeed();
        });
  
    
    }

}
