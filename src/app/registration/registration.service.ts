import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';


@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  host = /localhost/.test(window.location.origin) ? '' : window.location.origin;

  constructor(private httpClient: HttpClient) { }

  getRegistrationForm(eventId: string): Observable<unknown> {
    return this.httpClient.get(`${this.host}/handle.php`, {params: {form: 'REGDATA', id_event: eventId}})
  }

  sendRegistrationData(params: any): Observable<{success: boolean, Msg: string}> {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'multipart/form-data'
    // });
    return <any>this.httpClient.post(`${this.host}/handle.php`, params, {
      // headers,
      params: {form: 'Registration'}
    });
  }

  getDuplicateUserId(params: any): Observable<string> {
    return this.httpClient.post(`${this.host}/handle.php`, params, {params: {form: 'CheckAccount'}, responseType: 'text'});
  }

  checkMail(mail: any): Observable<any> {
    return this.httpClient.post(`${this.host}/handle.php`, {}, {params: {form: 'CheckMail', mail}});
  }

  confirmRegistration(md5key: string): Observable<any> {
    return this.httpClient.post(`${this.host}/handle.php`, {}, {params: {form: 'AcceptMail', md5key}});
  }

  confirmParticipation(md5key: string): Observable<any> {
    return this.httpClient.post(`${this.host}/handle.php`, {}, {params: {form: 'AcceptRegistration', md5key}});
  }
}
