import { Injectable } from '@angular/core';
import { Http, Response, Request } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
//import 'rxjs/Rx';  // use this line if you want to be lazy, otherwise:
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';  // debug
import 'rxjs/add/operator/catch';


/*
  Generated class for the ApiService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ApiService {
  baseUrl: string;
  data: any;


  constructor(private http: Http) {

  }

  getEvents(city, access) {
    return this.http.get('https://graph.facebook.com/search?q='+city+'&type=event&access_token='+access)
      .map(this.extractData)
      .catch(this.catchError)

  }

  extractData(res: Response) {
    return res.json();
  }

  catchError(error: Response | any) {
    console.log(error.json().error);
    return Observable.throw(error.json().error || "GET ERROR");
  }


}