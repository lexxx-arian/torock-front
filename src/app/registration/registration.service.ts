import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private httpClient: HttpClient) { }

  getRegistrationForm(eventId: string): Observable<unknown> {
    return this.httpClient.get('/reg-data.php', {params: {event: eventId}})
  }

  sendRegistrationData(params: any): Observable<string> {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'multipart/form-data'
    // });
    return this.httpClient.post('/reg.php', params, {params: {cmd: 'reg'}, responseType: 'text'});
  }
}
