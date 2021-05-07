import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { filter, map, tap } from 'rxjs/operators';
import { StoreService } from '../store.service';
import { CompetitionEntity } from '../api/api.interface';


@Injectable()
export class StartPageService {
  host = /localhost/.test(window.location.origin) ? '' : window.location.origin;
  constructor(
    private httpClient: HttpClient,
    private store: StoreService
  ) { }

  getEventList(): Observable<CompetitionEntity[]> {
    return this.httpClient.get<CompetitionEntity[]>(`${this.host}/handle.php`, {params: {'form': 'EventList', 'where': '1=1'}}).pipe(
      tap(res => this.store.setEventStore(res)),
      map(res => res.filter(competition => Boolean(Number(competition.is_public)) && !(Number(competition.is_deleted))))
    );
  }
}
