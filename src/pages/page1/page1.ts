import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import * as io from 'socket.io-client';
import { NavController, Content, AlertController, ToastController, NavParams } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import { Camera } from '@ionic-native/camera';
import { ChatService } from '../../providers/chat-service';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html',
  providers: [Camera]
})
export class Page1 {
  @ViewChild(Content) content: Content;
  @ViewChild('input') myInput;
  @ViewChild('myElement') myElement: ElementRef;
  messages: any = [];
  socketHost: string = "https://androidserverapp.herokuapp.com/";
  socket: any;
  chat: any;
  base64Image: string = undefined;
  username: string;
  zone: any;
  loggedIn: boolean = false;
  radius: number = 200;
  distance: any;
  showImage: boolean = false;
  elementt: any = 0;
  chatImgMe: string = null;
  chatImgThem: string = null;
  locationFound: any;
  messageImage: any;
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
  constructor(public navCtrl: NavController, public navParams: NavParams, private locationTracker: LocationTracker, private alertCtrl: AlertController, private toastCtrl: ToastController, private camera: Camera, private chatService: ChatService) {
    this.username = navParams.get('username');
  }

  ionViewDidLoad() {


    //TODO: loader för location? https://ionicframework.com/docs/components/#loading
  }

  ngOnInit() {
    this.loggedIn = true;
    if (this.myInput !== undefined) {
      setTimeout(() => {
        this.myInput.setFocus();
      }, 150);
    }
    // this.start();
    // this.socket = io.connect(this.socketHost);
    this.zone = new NgZone({ enableLongStackTrace: false });
    // this.socket.on("new message", (msg) => {
    //   this.zone.run(() => {
    //     console.log(msg);
    //     msg.timestamp = this.formatDate(msg.timestamp);
    //     var dis = this.getDistance(msg.latitude, msg.longitude);
    //     msg.latitude = Math.round(dis * 10) / 10;
    //     console.log("distance: ", msg.latitude, "radius: ", this.radius);
    //     if (msg.latitude <= this.radius) {
    //       this.messages.push(msg);
    //       this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight);
    //     }
    //   });
    // });

    this.chatService.componentMethodCalled$.subscribe(
      (data) => {
        this.startComponentMethod(data);
      }
    );
  }

  startComponentMethod(data) {
    console.log("data componentmethod", data);
        this.addMsg(data.data);
  }

  addMsg(msg) {

    console.log(msg);
    msg.timestamp = this.formatDate(msg.timestamp);
    var dis = this.getDistance(msg.latitude, msg.longitude);
    msg.latitude = Math.round(dis * 10) / 10;
    console.log("distance: ", msg.latitude, "radius: ", this.radius);
    if (msg.latitude <= this.radius) {
      this.zone.run(() => {
        this.messages.push(msg);
        console.log(this.content);
        //this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight);

      });
    }
  }

  chatSend(v) {
    var img = undefined;
    if (this.base64Image !== undefined) {
      img = this.base64Image;
    }

    let data: any = {
      username: this.username,
      message: v.chatText,
      latitude: this.locationTracker.lat,
      longitude: this.locationTracker.lng,
      image: img,
      timestamp: Date.now()
    };
    this.chatService.sendMsg(data);
    data.timestamp = this.formatDate(data.timestamp);
    data.latitude = Math.round(this.getDistance(data.latitude, data.longitude) * 10) / 10;
    this.chat = '';
    this.zone.run(() => {
      ;
      this.messages.push(data);
      this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight);
      this.base64Image = undefined;
    });

  }

  getDistance(lat, lon) {
    var lat1 = +lat;
    var lon1 = +lon;
    var lat2 = this.locationTracker.lat;
    var lon2 = this.locationTracker.lng;
    console.log("getDistance", lat1, lon1, "mina: ", this.locationTracker.lat, this.locationTracker.lng);
    var deg2rad = 0.017453292519943295; // === Math.PI / 180
    var cos = Math.cos;
    lat1 *= deg2rad;
    lon1 *= deg2rad;
    lat2 *= deg2rad;
    lon2 *= deg2rad;
    var diam = 12742000; // Diameter of the earth in km (2 * 6371)
    var dLat = lat2 - lat1;
    var dLon = lon2 - lon1;
    var a = (
      (1 - cos(dLat)) +
      (1 - cos(dLon)) * cos(lat1) * cos(lat2)
    ) / 2;

    return diam * Math.asin(Math.sqrt(a));
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

  stop() {
    this.locationTracker.stopTracking();
  }

  pressEvent(img) {
    //this.showImage = this.showImage ? false : true;
    this.messageImage = img;
    this.showImage = true;
  }

  touchEnd() {
    this.showImage = false;
  }

  takePicture(ev) {
    ev.close();
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      saveToPhotoAlbum: true

    }).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });

  }

  chooseImageFromGallery(ev) {
    ev.close();
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: 0

    }).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  radiusModal(ev) {
    ev.close();
    {
      let alert = this.alertCtrl.create({
        title: 'Change radius',
        message: 'Decide on how far away you want to receive messages from, in meters',
        inputs: [
          {
            name: 'radius',
            placeholder: 'Change radius...',
            min: 10,
            type: 'number'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              if (Number(data.radius)) {
                this.radius = data.radius;
                console.log(data, data.radius);
              }
            }
          }
        ]
      });
      alert.present();

    }
  }
}