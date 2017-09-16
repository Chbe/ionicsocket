import { Component, NgZone, ViewChild, } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, AlertController, ToastController, ModalController, App, ModalOptions, Platform } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import * as io from 'socket.io-client';
import { Location } from '../../providers/location';
import { ApiService } from '../../providers/api-service';
import CryptoJS from 'crypto-js';


/**
 * Generated class for the Chat page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [Camera, ApiService]
})
export class Chat {

  @ViewChild(Content) content: Content;
  @ViewChild('input') myInput;
  city: any;
  countryCode: any;
  messages: any = [];
  //http://localhost:3000/
  //https://androidserverapp.herokuapp.com/
  socketHost: string = "https://androidserverapp.herokuapp.com/";
  socket: any;
  chat: any;
  base64Image: string = undefined;
  username: string;
  zone: any;
  radius: number;
  distance: any;
  showImage: boolean = false;
  chatImgMe: string = null;
  chatImgThem: string = null;
  messageImage: any;
  onlineUsers: number;
  id: any;
  private key: string = 'mycryptswag1337';
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

  constructor(private platform: Platform, public navCtrl: NavController, public navParams: NavParams, private locationTracker: Location, private app: App, private alertCtrl: AlertController, private toastCtrl: ToastController, private camera: Camera, private apiService: ApiService, public modalCtrl: ModalController) {
    this.username = navParams.get('username');
    this.radius = navParams.get('radius');
  }

  ngOnInit() {
    this.zone = new NgZone({ enableLongStackTrace: false });

    if (!this.locationTracker.city) {
      console.log("debugging på dator, hårdkodad city och CC");
      this.city = 'Örebro';
      this.countryCode = 'SE';
    }
    else {
      this.city = this.locationTracker.city;
      this.countryCode = this.locationTracker.countryCode;
    }
  }

  ionViewWillEnter() {
    this.socket = io.connect(this.socketHost);

    this.socket.emit('request login', this.username);

    this.socket.on('login success', (data) => {
      this.socket.emit('add user', this.username, this.city);
    });

    this.socket.on('login fail', (data) => {
      this.app.getRootNav().setRoot('Login', { data: 'login fail' });
    });

    this.socket.on('user count', (data) => {
      console.log("data yao", data);
      this.onlineUsers = data.numbers;
      // this.socket.emit('request keys');
    });

    this.socket.on('event keys', (data) => {
      this.id = data.data;
    });

    this.socket.on("new message", (msg) => {
      this.zone.run(() => {
        // msg = this.decrypt(msg);
        console.log(msg);
        msg.timestamp = this.formatDate(msg.timestamp);
        if (msg.distance === 'website') {
          msg.distance = 'somewhere';
        }
        else {
          var dis = this.getDistance(msg.latitude, msg.longitude);
          msg.distance = Math.round(dis * 10) / 10;
          var x = msg.distance;

          if (msg.distance <= this.radius) {
            if (x <= 100.0) {
              msg.distance = 'very close';
            }
            else if (x <= 300.0 && x >= 100.1) {
              msg.distance = 'close';
            }

            else if (x <= 500.0 && x >= 300.1) {
              msg.distance = 'nearby';
            }
            else {
              msg.distance = '>500m away'
            }
          }
          this.messages.push(msg);
          this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight);
        }
      });
    });

    this.socket.on("new from bot", (msg) => {
      console.log(msg);
      this.zone.run(() => {
        // msg = this.decrypt(msg);
        msg.timestamp = this.formatDate(msg.timestamp);
        msg.distance = 'everywhere';
        this.messages.push(msg);
        this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight);
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Chat', this.username);

    if (this.myInput !== undefined) {
      setTimeout(() => {
        this.myInput.setFocus();
      }, 150);
    }
  }

  encrypt(data) {
    return new Promise(resolve => {
      data = CryptoJS.AES.encrypt(JSON.stringify(data), this.key);
      return resolve(data);
    })
  }

  decrypt(data) {
    return new Promise(resolve => {
      var bytes = CryptoJS.AES.decrypt(data.toString(), this.key);
      return resolve(JSON.parse(bytes.toString(CryptoJS.enc.Utf8)));
    })
  }

  async chatSend(v) {
    var img = null;
    if (this.base64Image !== undefined) {
      img = this.base64Image;
    }



    let data: any = {
      room: this.city,
      username: this.username,
      message: v.chatText,
      latitude: this.locationTracker.lat,
      longitude: this.locationTracker.lng,
      image: img,
      distance: null,
      timestamp: Date.now()
    };

    if (!this.platform.is('cordova')) {
      data.distance = 'website';
    }

    // var cipher =  await this.encrypt(JSON.stringify(data));

    // console.log("encrypt", cipher);

    // var uncipher = await this.decrypt(cipher);
    // console.log(uncipher);

    if (data.message.toLowerCase().includes('@pineanas') || this.onlineUsers == 1) {
      console.log("to bot");
      this.socket.emit('new message to bot', data);
    }
    else {
      this.socket.emit('new message', data);
    }


    data.timestamp = this.formatDate(data.timestamp);
    // data.distance = Math.round(this.getDistance(data.latitude, data.longitude) * 10) / 10;
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

  async eventsNearby() {
    var jsonData: any;
    // await this.apiService.getEvents(this.city, this.id)
    // .subscribe(data => jsonData = data.data);
    // let modal = this.modalCtrl.create('Events', { city: jsonData });
    // modal.present();
  }

  radiusModal(ev) {
    ev.close();

    const paramData = {
      radius: this.radius
    }

    const modal = this.modalCtrl.create('SettingsPage', { data: paramData }, { enableBackdropDismiss: false });

    modal.onDidDismiss(data => {
      this.radius = data.radius;
    });

    modal.present();

    // {
    //   let alert = this.alertCtrl.create({
    //     title: 'Change radius',
    //     subTitle: 'Decide on how far away you want to receive messages from, in meters',
    //     message: 'Current radius: ' + this.radius,
    //     inputs: [
    //       {
    //         name: 'radius',
    //         min: 20,
    //         type: 'range',
    //         max: 5000,
    //         id: 'inputRange',
    //       }
    //     ],
    //     buttons: [
    //       {
    //         text: 'Cancel',
    //         role: 'cancel',
    //         handler: data => {
    //           console.log('Cancel clicked');
    //         }
    //       },
    //       {
    //         text: 'Save',
    //         handler: data => {
    //           if (Number(data.radius) >= 20 && Number(data.radius) <= 5000) {
    //             this.radius = data.radius;
    //             console.log(data, data.radius);
    //           }
    //         }
    //       }
    //     ]
    //   });
    //   alert.present();

    // }
  }



}
