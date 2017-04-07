import { Injectable, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';



@Injectable()
export class LocationTracker {

  public watch: any;
  public lat: number;
  public lng: number;

  constructor(public zone: NgZone, private geolocation: Geolocation) {

  }

  startTracking() {

    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.watch = this.geolocation.watchPosition();
    this.watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      if (data.coords.latitude !== undefined) {
        this.lat = data.coords.latitude;
        this.lng = data.coords.longitude;
      }
    });

  }

  stopTracking() {
    this.watch.unsubscribe();
  }

}