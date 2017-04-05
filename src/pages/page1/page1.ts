import { Component, NgZone, ViewChild } from '@angular/core';
import * as io from 'socket.io-client';
import { NavController, Content } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  @ViewChild(Content) content: Content;
  messages: any = [];
  socketHost: string = "https://androidserverapp.herokuapp.com/";
  socket: any;
  chat: any;
  username: string;
  zone: any;
  loggedIn: boolean = false;
  COLORS = [
    '#FF0000',
    '#00FFFF', '#C0C0C0',
    '#0000FF', '#808080',
    '#0000A0', '#000000',
    '#ADD8E6', '#FFA500',
    '#800080', '#A52A2A',
    '#FFFF00', '#800000',
    '#00FF00', '#008000',
    '#FF00FF', '#808000',
  ];
  constructor(public navCtrl: NavController, private locationTracker: LocationTracker) {
    this.socket = io.connect(this.socketHost);

    this.zone = new NgZone({ enableLongStackTrace: false });
    this.socket.on("new message", (msg) => {
      this.zone.run(() => {
        console.log(msg);
        msg.timestamp = this.formatDate(msg.timestamp);
        this.messages.push(msg);
        this.content.scrollToBottom();
      });
    });

  }

  chatSend(v) {
    let data:any = {
      username: this.username,
      message: v.chatText,
      latitude: this.locationTracker.lat,
      longitude: this.locationTracker.lng,
      timestamp: Date.now()
    };
    this.socket.emit('new message', data);
    data.timestamp = this.formatDate(data.timestamp);
    this.chat = '';
    this.zone.run(() => {
      ;
      this.messages.push(data);
      this.content.scrollToBottom();
    });

  }

  logForm() {
    this.loggedIn = true;
    this.start();
    this.socket.emit('add user', this.username);

  }

  formatDate(dateObj) {
    var d = new Date(dateObj);
    var hours = d.getHours();
    var minutes = d.getMinutes().toString();

    return hours + ":" + (minutes.length === 1 ? '0' + minutes : minutes);
  }

  getUsernameColor(username) {
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    var index = Math.abs(hash % this.COLORS.length);
    return this.COLORS[index];
  }

  start(){
    this.locationTracker.startTracking();
  }
 
  stop(){
    this.locationTracker.stopTracking();
  }



}