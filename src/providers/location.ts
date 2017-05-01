import { Injectable } from '@angular/core';
import 'rxjs';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';

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
  public countryCode: any;
  public city: any;

  constructor(private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
    console.log('Hello Location Provider');
    this.startTracking();
  }

  startTracking() {

    this.geolocation.getCurrentPosition().then((resp) => {
      this.getGeocodeFromCoords(resp.coords.latitude, resp.coords.longitude)
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

  getGeocodeFromCoords(lat, lng) {
    this.nativeGeocoder.reverseGeocode(lat, lng)
      .then((result: NativeGeocoderReverseResult) => {
        console.log("You are in country", result.countryName, "in city", result.city, "country code", result.countryCode);
        this.city = result.city;
        this.countryCode = result.countryCode;
      })
      .catch((error: any) => console.log(error));
  }

  checkIfNewCity() {
    setInterval(function () {
      console.log("Kollar efter ny stad");
      this.nativeGeocoder.reverseGeocode(this.lat, this.lng)
        .then((result: NativeGeocoderReverseResult) => {
          if (this.city !== result.city) {

          }
          // this.city = result.city;
          // this.countryCode = result.countryCode;
        })
        .catch((error: any) => console.log(error));
    }, 900000);
  }

}
