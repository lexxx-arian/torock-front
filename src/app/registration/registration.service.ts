import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  host = window.location.origin;

  constructor(private httpClient: HttpClient) { }

  getRegistrationForm(eventId: string): Observable<unknown> {
    return this.httpClient.get(`${this.host}/reg-data.php`, {params: {event: eventId}})
  }

  sendRegistrationData(params: any): Observable<string> {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'multipart/form-data'
    // });
    return this.httpClient.post(`${this.host}/reg.php`, params, {params: {cmd: 'reg'}, responseType: 'text'});
  }
}
