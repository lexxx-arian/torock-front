import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { CompetitionEntity } from '../api/api.interface';


@Injectable()
export class EventDetailService {
  host = /localhost/.test(window.location.origin) ? '' : window.location.origin;
  constructor(
    private httpClient: HttpClient
  ) { }

  getEventDetail(competitionId: string): Observable<CompetitionEntity> {
    return this.httpClient.get<CompetitionEntity>(`${this.host}/handle.php`, {params: {'form': 'Event', 'id_event': competitionId}});
  }
}
