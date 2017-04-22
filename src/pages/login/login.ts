import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController } from 'ionic-angular';
import { Location } from '../../providers/location';

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
})
export class Login {
  username: any;
  radius: number = 200;

  constructor(public navCtrl: NavController, public navParams: NavParams, private locationTracker: Location, private app: App, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  login() {
    if (this.locationTracker.lat !== undefined) {
      // this.chatService.login(this.username);
      console.log(this.username);
      this.app.getRootNav().setRoot('Chat', {
        username: this.username
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
