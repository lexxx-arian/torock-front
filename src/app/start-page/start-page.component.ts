import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { StartPageService } from './start-page.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StartPageService]
})
export class StartPageComponent implements OnInit {
  eventList$ = this.startPageService.getEventList().pipe(map(res => res.reverse()));

  constructor(private startPageService: StartPageService) { }

  ngOnInit(): void {
  }

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

}
