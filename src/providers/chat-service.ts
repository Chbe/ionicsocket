import { Injectable, NgZone } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs/Subject';



@Injectable()
export class ChatService {
    private componentMethodCallSource = new Subject<any>();
    socketHost: string = "https://androidserverapp.herokuapp.com/";
    socket: any;
    zone: any;

    constructor() {
        console.log("chat service init");
        this.socket = io.connect(this.socketHost);
    }

    componentMethodCalled$ = this.componentMethodCallSource.asObservable();

    callComponentMethod(data) {
        this.componentMethodCallSource.next(data);
    }

    msgListener() {
        // this.zone = new NgZone({ enableLongStackTrace: false });
        this.socket.on("new message", (msg) => {
            console.log("new message", msg);
            // this.zone.run(() => {
                this.callComponentMethod({ type: 'new message', data: msg });
            // });''
        });
    }

    login(username) {
        this.socket.emit('add user', username);
        this.msgListener();
    }

    sendMsg(data) {
        this.socket.emit('new message', data);
    }
}