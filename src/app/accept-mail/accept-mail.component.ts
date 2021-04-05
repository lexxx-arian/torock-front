import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RegistrationService } from '../registration/registration.service';

@Component({
  selector: 'app-accept-mail',
  templateUrl: './accept-mail.component.html',
  styleUrls: ['./accept-mail.component.scss']
})
export class AcceptMailComponent implements OnInit {
  responseMessage: string = '';

  constructor(private activatedRoute: ActivatedRoute, private registrationService: RegistrationService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      switchMap(queryParamMap => {
        const md5key = queryParamMap['md5key'];
        return this.registrationService.confirmRegistration(md5key);
      })
    ).subscribe(res => this.responseMessage = res.Msg);
  }

}
