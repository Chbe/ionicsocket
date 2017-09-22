import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview';

/**
 * Generated class for the CameraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
  providers: [CameraPreview, Camera]
})
export class CameraPage {
  picture: any;
  takephotopic: any;
  colorEffects: any = ['mono', 'negative', 'posterize', 'sepia', 'none'];
  selectedColorEffect: number = -1;

  constructor(public navCtrl: NavController, public navParams: NavParams, private cameraPreview: CameraPreview, private camera: Camera, private events: Events, private platform: Platform) {
    this.takephotopic = 'assets/yes.png';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
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
          this.cameraPreview.setFocusMode('auto');
        },
        (err) => {
          console.log("ERRORYAO", err)
        });
    });
  }

  newPhoto() {
    this.picture = undefined;
  }

  takePhoto() {
    console.log("its clicked");
    const pictureOpts: CameraPreviewPictureOptions = {
      // width: 1280,
      // height: 1280,
      quality: 85
    }

    // take a picture
    this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
      this.picture = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
      this.picture = undefined;
    });
  }

  switchCamera(ev) {
    ev.close();
    this.cameraPreview.switchCamera();
  }

  chooseImageFromGallery(ev) {
    ev.close();
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: 0

    }).then((imageData) => {
      this.picture = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  effects(ev) {
    this.selectedColorEffect++;
    this.cameraPreview.setColorEffect(this.colorEffects[this.selectedColorEffect]);
    if (this.selectedColorEffect === 5) {
      this.selectedColorEffect = -1;
    }
  }

  back() {
    if (this.picture) {
      let picNav = {
        picture: this.picture
      }
      this.events.publish('picture:taken', picNav);
      this.cameraPreview.stopCamera();
      this.navCtrl.popToRoot();
    }

    else {
      this.cameraPreview.stopCamera();
      this.navCtrl.popToRoot();
    }

  }

}
