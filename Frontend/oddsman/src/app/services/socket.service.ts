import { Injectable } from '@angular/core';
import * as socketIo  from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';



const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class SocketService {

  constructor() { }

  private socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public disconnectSocket(): void {
      this.socket.disconnect();
    }

    public send(action: Action): void {
        this.socket.emit('action', action);
    }

    public onMessage(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('response', (data:string) => {
              observer.next(data)
            });
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}

export enum Action {
  ODDS = 'refresh_odds',
  RESULTS = 'refresh_results'

}
 
export enum Event {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect'
}