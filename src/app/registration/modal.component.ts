import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: 'modal-success-registration',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left"  [innerHTML]="title"></h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p [innerHTML]="body"></p>
    </div>
    <div class="modal-footer" *ngIf="hasAdditionalButton">
      <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">Зарегистрироваться еще</button>
    </div>
  `
})

export class ModalSuccessRegistrationComponent {
  title: string;
  body: string;
  eventName: string;
  closeBtnName: string;
  registrationNumber: string;
  hasAdditionalButton = false;

  constructor(public bsModalRef: BsModalRef) {}
}
