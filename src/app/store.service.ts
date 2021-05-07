import { Injectable } from '@angular/core';
import { CompetitionEntity } from './api/api.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private eventList: CompetitionEntity[] = [];

  constructor() { }

  setEventStore(eventList:CompetitionEntity[]): void {
    console.log(eventList
      .map(competition => ({isPublic: competition.is_public, isDeleted: competition.is_deleted, state: competition.state, eventName: competition.event_name, }))
    );
    this.eventList = eventList;
  }

  getEventDetails(eventId: string): CompetitionEntity | null | undefined {
    return this.eventList.find(item => item.id === eventId);
  }
}
