import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/operators';
import { RegistrationService } from '../registration/registration.service';

@Component({
  selector: 'app-accept-participation',
  templateUrl: './accept-participation.component.html',
  styleUrls: ['./accept-participation.component.scss']
})
export class AcceptParticipationComponent implements OnInit {
  responseMessage: string = '';
  registrationResult: Observable<any>;

  constructor(private activatedRoute: ActivatedRoute, private registrationService: RegistrationService) { }

  ngOnInit(): void {
    this.registrationResult = this.activatedRoute.queryParams.pipe(
      switchMap(queryParamMap => {
        const md5key = queryParamMap['md5key'];
        return this.registrationService.confirmParticipation(md5key);
      })
    );
  }

}
