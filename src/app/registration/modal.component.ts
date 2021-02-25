import { Component } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: 'modal-success-registration',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{title}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <h3>Поздравляем!!!</h3>
      <p>
        Вызаргеристрированы под номером: {{registrationNumber}}
      </p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">закрыть</button>
    </div>
  `
})

export class ModalSuccessRegistrationComponent {
  title: string;
  closeBtnName: string;
  registrationNumber: string;

  constructor(public bsModalRef: BsModalRef) {}
}
