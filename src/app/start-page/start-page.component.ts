import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { StartPageService } from './start-page.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StartPageService]
})
export class StartPageComponent implements OnInit {
  eventList$ = this.startPageService.getEventList().pipe(
    switchMap(res => combineLatest([
      of(res),
      this.availableCompetition.valueChanges.pipe(startWith(true)),
      this.competitionSearch.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(res => console.log('search string: %s', res)),
        startWith('')
      )
    ])),
    map(([res, isShowAvailable, searchString]) => {
      const preparedCompetitionList = res
        .filter(competition => isShowAvailable ? !(Number(competition.state) === 0 || Number(competition.state) > 4) : true)
        .filter(competition => {
          if (!searchString) {
            return true;
          }
          const searchRegExp = new RegExp(searchString, 'i');
          return Object.values(competition).some(competitionValue => searchRegExp.test(competitionValue));
        })
        .reverse();
      return preparedCompetitionList.length ? preparedCompetitionList : null
    }),
  );
  availableCompetition = new FormControl(true, {});
  competitionSearch = new FormControl('', {});

  constructor(private startPageService: StartPageService, private router: Router) { }

  ngOnInit(): void {}

  getBackgroundClass(discipline: string): string {
    let backgroundClass = 'default';
    switch (discipline) {
      case 'альпинизм':
        backgroundClass = 'mountaineering';
        break;
      case 'велошняга':
        backgroundClass = 'bikering';
        break;
      case 'скайраннинг':
        backgroundClass = 'skyrunning';
        break;
      default:
        backgroundClass = 'default'
        break;
    }
    return backgroundClass;
  }

  gotoEventPage(event: Event, eventId: string): void {
    event.preventDefault();
    this.router.navigate([`/event-detail/${eventId}`]);
  }
}

