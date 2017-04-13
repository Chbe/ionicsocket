import { Component } from '@angular/core';
import { LocationTracker } from '../../providers/location-tracker';
import { NavController, NavParams, ToastController, App } from 'ionic-angular';
import { ChatService } from '../../providers/chat-service';
import { Page1 } from '../page1/page1';

@Component({
  selector: 'loginPage',
  templateUrl: 'loginPage.html'
})
export class LoginPage {
  username: any;
  radius: number = 200;

  constructor(private app: App, public navCtrl: NavController, public navParams: NavParams, private locationTracker: LocationTracker, private chatService: ChatService, private toastCtrl: ToastController) {
    
  }

  login() {
    if (this.locationTracker.lat !== undefined) {
      this.chatService.login(this.username);
      this.app.getRootNav().setRoot(Page1, {
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
