import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs';
import { Geolocation } from '@ionic-native/geolocation';

/*
  Generated class for the Location provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Location {

  public watch: any;
  public lat: number;
  public lng: number;

  constructor(private geolocation: Geolocation) {
    console.log('Hello Location Provider');
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
