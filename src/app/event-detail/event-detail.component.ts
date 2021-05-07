import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StoreService } from '../store.service';
import { EventDetailService } from './event-detail.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  providers: [EventDetailService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailComponent implements OnInit {
  eventDetails: any = null

  constructor(private activatedRoute: ActivatedRoute, private store: StoreService, private cdr: ChangeDetectorRef, private eventDetailService: EventDetailService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(res => {
        const competitionId = String(res.get('id'));
        return this.store.getEventDetails(competitionId) ? of(this.store.getEventDetails(competitionId)) : this.eventDetailService.getEventDetail(competitionId);
      })
    ).subscribe(res => {
      this.eventDetails = res;
      console.log(this.eventDetails);
      this.cdr.markForCheck();
    });
  }

}
