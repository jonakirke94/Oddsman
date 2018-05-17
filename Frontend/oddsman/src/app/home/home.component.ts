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

  //temporary
  constructor(private _socket: SocketService) {
  }

  ngOnInit() {
    this._socket.initSocket();
  }

  sendMessage() {
    let message = "TEST MESSAGE FROM HOME COMPONENT"
    this._socket.send(Action.ODDS);
  }

}
