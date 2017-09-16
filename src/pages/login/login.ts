import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, Platform } from 'ionic-angular';
import { Location } from '../../providers/location';
import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview';
import { Keyboard } from '@ionic-native/keyboard';

/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [CameraPreview, Keyboard]
})
export class Login {
  username: any;
  radius: number = 200;
  hide: boolean = false;
  placeholder: string = 'Type nickname...'

  constructor(public navCtrl: NavController, public navParams: NavParams, private locationTracker: Location, private app: App, private toastCtrl: ToastController, private cameraPreview: CameraPreview, private platform: Platform, private keyboard: Keyboard) {
    if(this.navParams.get('data') === 'login fail') {
      this.placeholder = 'Sorry, username taken';
    }
    this.keyboard.onKeyboardShow().subscribe(sub => {
      console.log("key board hide");
      this.hide = true;
    });

    this.keyboard.onKeyboardHide().subscribe(sub => {
      console.log("key board show");
      this.hide = false;
    });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: 'rear',
      tapPhoto: true,
      previewDrag: true,
      toBack: true,
      alpha: 1
    };

    // start camera
    this.platform.ready().then(() => {
      this.cameraPreview.startCamera(cameraPreviewOpts).then(
        (res) => {
          console.log("Shhit works", res)
        },
        (err) => {
          console.log("ERRORYAO", err)
        });
    });
  }

  login() {
    var username = this.username.trim();
    if (!this.platform.is('cordova') || this.locationTracker.lat && username !== "") { // && this.locationTracker.city
      // this.chatService.login(this.username);
      console.log(this.username, username);
      this.cameraPreview.stopCamera();
      this.app.getRootNav().setRoot('Chat', {
        username: username,
        radius: this.radius
      });
    }
    else {
      var self = this;
      let toast = self.toastCtrl.create({
        message: "Can't seem to find your location, check your settings",
        duration: 3000,
        position: 'bottom'
      });

      toast.onDidDismiss(() => {
      });

      toast.present();
    }

  }

}
