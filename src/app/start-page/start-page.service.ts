import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class StartPageService {
  host = /localhost/.test(window.location.origin) ? '' : window.location.origin;
  constructor(private httpClient: HttpClient) { }

  getEventList(): Observable<any> {
    return this.httpClient.get('handle.php', {params: {'form': 'EventList'}});
  }
}
