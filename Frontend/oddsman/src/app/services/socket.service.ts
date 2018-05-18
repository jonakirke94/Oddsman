import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';



const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class SocketService {

    constructor() { }


    private socket;
    messages = [];

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public disconnectSocket(): void {
        this.socket.disconnect();
    }

    public send(action: Action): void {
        this.socket.emit('action', action);
    }

    public onOddsMessage(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('refresh_odds', (data) => {
                console.log(data)
                observer.next(data)
            });
        }).shareReplay();
    }

    /*     public sendX(message: string): void {
            this.socket.emit('message', message)
            //this.onMessage().subscribe(res => console.log(res));
        }
    
        public onMessage(): Observable<string> {
            return new Observable<string>(observer => {
                this.socket.on('message', (data: string) => observer.next(data));
            });
        } */



    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}

export enum Action {
    ODDS = 'new_odds',
    RESULTS = 'new_results'
}

export enum Event {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect'
}