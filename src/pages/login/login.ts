import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, Platform } from 'ionic-angular';
import { Location } from '../../providers/location';
import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview';

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
  providers: [CameraPreview]
})
export class Login {
  username: any;
  radius: number = 200;

  constructor(public navCtrl: NavController, public navParams: NavParams, private locationTracker: Location, private app: App, private toastCtrl: ToastController, private cameraPreview: CameraPreview, private platform: Platform) {
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
    if (this.locationTracker.lat) { // && this.locationTracker.city
      // this.chatService.login(this.username);
      console.log(this.username);
      this.cameraPreview.stopCamera();
      this.app.getRootNav().setRoot('Chat', {
        username: this.username,
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
