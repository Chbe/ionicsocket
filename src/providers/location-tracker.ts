import { Injectable, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs';



@Injectable()
export class LocationTracker {

  public watch: any;
  public lat: number;
  public lng: number;

  constructor(public zone: NgZone, private geolocation: Geolocation) {
    console.log("location service init");
    this.startTracking();
  }

  startTracking() {

    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.watch = this.geolocation.watchPosition({ enableHighAccuracy: true })
      .filter((p) => p.coords !== undefined) //Filter Out Errors
      .subscribe(position => {
        console.log(position.coords.longitude + ' ' + position.coords.latitude);
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });

  }

  stopTracking() {
    this.watch.unsubscribe();
  }

}