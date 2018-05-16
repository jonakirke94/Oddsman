import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { StandingComponent } from "../standing/standing.component";
import { SocketService, Action, Event } from '../services/socket.service';

@Component({
  selector: 'app-standing',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})



export class HomeComponent implements OnInit {

 /*  messageText: string;
  messages: Array<any>;
  socket: SocketIOClient.Socket; */
  messages = [];
  ioConnection: any;


  constructor(private _socket : SocketService) {
  }

  ngOnInit() {
    this.initIoConnection();
    this._socket.send(Action.ODDS);

  }

  ngOnDestroy() {
    this._socket.disconnectSocket();
  }

  private initIoConnection(): void {
    this._socket.initSocket();

    this.ioConnection = this._socket.onMessage()
    .subscribe((message) => {
      this.messages.push(message);
      console.log(this.messages)
    });


    this._socket.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this._socket.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });

  }

/*   sendTestMessage() {
    const message = 'TESTTESTEST';
    this._socket.send(message);

  } */
/* 
  sendSocket() {
  const message = 'TEST_ACTION_METHOD';

   this._socket.send(message);
  }


 */


}
